import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// Save token to the database and send verification email
const sendMail = async (email: string, subject: string, text: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  const mailOptions = {
    from: process.env.NODEMAILER_USER,
    to: email,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendMail;
