import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS, // Gmail App Password
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
) => {
  await transporter.sendMail({
    from: `"Support" <${process.env.MAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });
};


