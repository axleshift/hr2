import * as nodemailer from "nodemailer";
import { config } from "../config";
import logger from "../middlewares/logger";

// Configure the transporter once
const transporter = nodemailer.createTransport({
  host: config.google.smtp.host,
  port: Number(config.google.smtp.port) || 0,
  secure: config.google.smtp.secure || false,
  auth: {
    user: config.google.smtp.user,
    pass: config.google.smtp.pass,
  },
} as nodemailer.SendMailOptions);

/**
 * Sends an email using nodemailer
 * @param to Recipient email address
 * @param subject Email subject
 * @param text Plain text email body
 * @param html (Optional) HTML email body
 */
export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    const mailOptions = {
      from: '"Facility Events" <no-reply@hr2.axleshift.com/>',
      to,
      subject,
      text,
      html,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}`)
    return { success: true, message: `Email sent to ${to}` };
  } catch (error) {
    logger.error("Error sending email:", error);
    return { success: false, message: "Error sending email" };
  }
};
