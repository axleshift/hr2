"use strict";
/**
 * @file fileUploadHandler.ts
 * @description File upload handler for the Node.js Express API. Handles file uploads using Multer.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const multer_1 = __importDefault(require("multer"));
const config_1 = require("../config");
// Create the main upload directory if it doesn't exist
const dest = path_1.default.join(config_1.config.fileServer.dir);
if (!fs_1.default.existsSync(dest)) {
    fs_1.default.mkdirSync(dest, { recursive: true });
}
// Setup storage engine for uploaded files
const upload = (baseDir) => {
    const storage = multer_1.default.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path_1.default.join(dest, baseDir, file.fieldname);
            if (!fs_1.default.existsSync(uploadPath)) {
                fs_1.default.mkdirSync(uploadPath, { recursive: true });
            }
            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, "-").toLowerCase()}`);
        },
    });
    return (0, multer_1.default)({
        storage,
        fileFilter: (req, file, cb) => {
            const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
            const extname = filetypes.test(path_1.default.extname(file.originalname).toLowerCase());
            const mimetype = filetypes.test(file.mimetype);
            if (extname && mimetype) {
                return cb(null, true);
            }
            else {
                cb(new Error("File type not supported"));
            }
        },
    });
};
exports.upload = upload;
