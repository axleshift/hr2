"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("../config");
const logger_1 = __importDefault(require("../middlewares/logger"));
// Configure the transporter once
const transporter = nodemailer.createTransport({
    host: config_1.config.google.smtp.host,
    port: Number(config_1.config.google.smtp.port) || 0,
    secure: config_1.config.google.smtp.secure || false,
    auth: {
        user: config_1.config.google.smtp.user,
        pass: config_1.config.google.smtp.pass,
    },
});
/**
 * Sends an email using nodemailer
 * @param to Recipient email address
 * @param subject Email subject
 * @param text Plain text email body
 * @param html (Optional) HTML email body
 */
const sendEmail = async (to, subject, text, html) => {
    try {
        const mailOptions = {
            from: '"Facility Events" <no-reply@hr2.axleshift.com/>',
            to,
            subject,
            text,
            html,
        };
        await transporter.sendMail(mailOptions);
        logger_1.default.info(`Email sent to ${to}`);
        return { success: true, message: `Email sent to ${to}` };
    }
    catch (error) {
        logger_1.default.error("Error sending email:", error);
        return { success: false, message: "Error sending email" };
    }
};
exports.sendEmail = sendEmail;
