import nodemailer from "nodemailer";

const mailPort = Number(process.env.MAIL_PORT);

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: mailPort,
  secure: mailPort === 465,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendEmail = async ({ to, subject, text }) => {
  return await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
  });
};
