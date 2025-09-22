import {Request, Response} from 'express';
import { prisma } from '../config/prisma';
import {hashValue} from '../utils/bcrypt';
import {sendMail} from '../utils/mailer';
import {generateOTP} from '../utils/otp';

// User Registration
export const registerUser = async (req: Request, res: Response) => {
    try {
        const body = req.body || {};
        const {email, password} = body;

        if (!email || !password) {
            return res.status(400).json({message: 'email and password are required'});
        }   

        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        // hash the password before storing
        const hashedPassword = await hashValue(password);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                isVerified: false,
                MFAEnabled: false,
            },
        });

        // Generate OTP for email verification
        const otp = generateOTP();
        const hashedOTP = await hashValue(otp);

        await prisma.oTP.create({
            data: {
                code: hashedOTP,
                userId: newUser.id,
                expireAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
            },
        });

        // Send OTP to user's email
        await sendMail(email, 'Your OTP Code', `Your OTP is: ${otp}`);

        // Respond to client
        return res.status(201).json({message: 'User registered. OTP sent to email.'});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error', error});
    }
}