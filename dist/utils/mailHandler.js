"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = exports.verifyMailConn = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// import { config } from '../config';
const logger_1 = __importDefault(require("../middlewares/logger"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
// Configure the transporter
// logger.info(JSON.stringify(config, null, 2))
// logger.info(config.google.smtp.host)
// logger.info(process.env.SMTP_HOST)
// DO NOT WORK
// const transporter: Transporter = nodemailer.createTransport({
//   host: config.google.smtp.host?.toString(),
//   port: Number(config.google.smtp.port),
//   auth: {
//     user: config.google.smtp.user?.toString(),
//     pass: config.google.smtp.pass?.toString(),
//   },
//   logger: true,
//   debug: true,
// } as unknown as SMTPTransport.Options);
// DO NOT WORK
// const transporter: Transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST?.toString(),
//   port: Number(process.env.SMTP_PORT),
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS
//   },
//   logger: true,
//   debug: true,
// } as SMTPTransport.Options);
// WORKS
// const transporter: Transporter = nodemailer.createTransport({
//   host: 'smtp.ethereal.email',
//   port: 587,
//   auth: {
//     user: 'donald.rogahn15@ethereal.email',
//     pass: 'hvSxFSXETupEA1Uq4g'
//   },
//   logger: true,
//   debug: true,
// } as SMTPTransport.Options);
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: 'hr2axleshift@gmail.com',
        pass: 'xdfonwngnzqbxidt'
    },
    logger: true,
    debug: true,
});
/**
 * Verifies the SMTP connection configuration.
 * @returns A promise that resolves with the verification result.
 */
const verifyMailConn = async () => {
    try {
        logger_1.default.info('📨 Verifying SMTP...');
        await transporter.verify();
        logger_1.default.info('SMTP connection verified successfully.');
    }
    catch (error) {
        logger_1.default.error('SMTP connection verification failed:', JSON.stringify(error, null, 2));
        throw error;
    }
};
exports.verifyMailConn = verifyMailConn;
/**
 * Sends an email using Nodemailer to one or multiple recipients.
 * @param title Title of the emnail
 * @param to Recipient email address(es).
 * @param subject Email subject.
 * @param text Plain text email body.
 * @param html Optional HTML email body.
 * @returns A promise that resolves with the send operation result.
 */
const sendEmail = async (title, to, subject, text, html) => {
    try {
        const recipients = Array.isArray(to) ? to.join(', ') : to;
        const mailOptions = {
            from: `"${title}" <no-reply@hr2.axleshift.com>`,
            to: recipients,
            subject,
            text,
            html,
        };
        await transporter.sendMail(mailOptions);
        logger_1.default.info(`Email sent to: ${recipients}`);
        return { success: true, message: `Email sent to: ${recipients}` };
    }
    catch (error) {
        logger_1.default.error('Error sending email:', error);
        return { success: false, message: `Error sending email` };
    }
};
exports.sendEmail = sendEmail;
