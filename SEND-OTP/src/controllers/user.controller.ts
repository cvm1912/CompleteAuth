import { Request, Response } from "express";
import { prisma } from "../config/prisma";
import { hashValue, compareValue } from "../utils/bcrypt";
import { sendMail } from "../utils/mailer";
import { generateOTP } from "../utils/otp";
import { generateToken } from "../utils/jwt";
import { compare } from "bcryptjs";




// User Registration
export const registerUser = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const { email, password } = body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
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

    //  
    await prisma.oTP.create({
      data: {
        code: hashedOTP,
        userId: newUser.id,
        expireAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes from now
      },
    });

    // Send OTP to user's email
    await sendMail(email, "Your OTP Code", `Your OTP is: ${otp}`);

    // Respond to client
    return res
      .status(201)
      .json({ message: "User registered. OTP sent to email." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};



// OTP Verification Flow
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    //  user submit email and otp
    const body = req.body || {};
    const { email, otp } = body;

    //Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "email and otp are required" });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // Fetch latest OTP for the user
    const latestOTP = await prisma.oTP.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!latestOTP) {
      return res.status(400).json({ message: "OTP not found" });
    }

    //  OTP Expiry and Match Check
    if (latestOTP.expireAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    // Compare provided OTP with stored hashed OTP
    const isOTPValid = await compareValue(otp, latestOTP.code);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Mark user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, MFAEnabled: false },
    });
    await prisma.oTP.delete({ where: { id: latestOTP.id } });

    return res
      .status(200)
      .json({ message: "OTP verified. User is now verified." });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};



export const loginUser = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const { email, password } = body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "email and password are required" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isPasswordValid = await compareValue(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "User not verified" });
    }

    // If MFA is enabled, send OTP
    if (user.MFAEnabled) {
      const otp = generateOTP();
      const hashedOTP = await hashValue(otp);

      await prisma.oTP.create({
        data: {
          code: hashedOTP,
          userId: user.id,
          expireAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
        },
      });

      await sendMail(email, "Your MFA OTP Code", `Your OTP is: ${otp}`);
      return res.status(200).json({ message: "OTP sent to email for MFA verification" });
    }

    // If MFA not enabled, login directly
    const token = generateToken({ userId: user.id });
    return res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
};

export const verifyMFA = async (req: Request, res: Response) => {
  try {
    //  user submit email and otp
    const body = req.body || {};
    const { email, otp } = body;

    //Validate input
    if (!email || !otp) {
      return res.status(400).json({ message: "email and otp are required" });
    }
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    if (!user.MFAEnabled) {
        return res.status(400).json({ message: "MFA not enabled for this user" });
    }
    // Fetch latest OTP for the user
    const latestOTP = await prisma.oTP.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
    });
    if (!latestOTP) {
        return res.status(400).json({ message: "OTP not found" });
        }
    //  OTP Expiry and Match Check
    if (latestOTP.expireAt < new Date()) {
        return res.status(400).json({ message: "OTP expired" });
    }
    // Compare provided OTP with stored hashed OTP
    const isOTPValid = await compareValue(otp, latestOTP.code);
    if (!isOTPValid) {
        return res.status(400).json({ message: "Invalid OTP" });
    }
        // Mark user as verified
        await prisma.user.update({  
            where: { id: user.id },
            data: { isVerified: true, MFAEnabled: true },
        });
        await prisma.oTP.delete({ where: { id: latestOTP.id } });
        // generate JWT or session here for authenticated user
        const token = generateToken({ userId: user.id });
        return res.status(200).json({ message: "MFA verified. Login successful", token });
    } catch (error) {
        return res.status(500).json({ message: "Internal server error", error });
    }
};
 

export const forgotPassword = async (req: Request, res: Response) => {
  try {  
    const body = req.body || {};
    const { email } = body;
    if (!email) {
      return res.status(400).json({ message: "email is required" });
    }
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // generate otp for password reset
    const otp = generateOTP();
    const hashedOTP = await hashValue(otp);

    await prisma.oTP.create({
      data: {
        code: hashedOTP,
        userId: user.id,
        expireAt: new Date(Date.now() + 2 * 60 * 1000), // 2 minutes
      },
    });

    await sendMail(email, "Your Password Reset OTP", `Your OTP is: ${otp}`);
    return res.status(200).json({ message: "OTP sent to email for password reset" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}


export const resetPassword = async (req: Request, res: Response) => {
  try {
    const body = req.body || {};
    const { email, otp, newPassword } = body;   
    if (!email || !otp || !newPassword) {   
      return res.status(400).json({ message: "email, otp and newPassword are required" });  
  
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    // Fetch latest OTP for the user
    const latestOTP = await prisma.oTP.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    if (!latestOTP) {
      return res.status(400).json({ message: "OTP not found" });
    }
    //  OTP Expiry and Match Check
    if (latestOTP.expireAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }
    // Compare provided OTP with stored hashed OTP
    const isOTPValid = await compareValue(otp, latestOTP.code);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    // Hash the new password
    const hashedPassword = await hashValue(newPassword);
    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    // Delete the used OTP
    await prisma.oTP.delete({ where: { id: latestOTP.id } });
    return res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error });
  }
}