/**
 * @file fileUploadHandler.ts
 * @description File upload handler for the Node.js Express API. Handles file uploads using Multer.
 */

import fs from "fs";
import path from "path";
import multer from "multer";
import { config } from "../config";

// Create the main upload directory if it doesn't exist
const dest = path.join(config.fileServer.dir);
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// Setup storage engine for uploaded files
export const upload = (baseDir: string) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = path.join(dest, baseDir, file.fieldname);
      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, "-").toLowerCase()}`);
    },
  });

  return multer({
    storage,
    fileFilter: (req, file, cb) => {
      const filetypes = /pdf|doc|docx|jpg|jpeg|png/;
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = filetypes.test(file.mimetype);
      if (extname && mimetype) {
        return cb(null, true);
      } else {
        cb(new Error("File type not supported"));
      }
    },
  });
};
