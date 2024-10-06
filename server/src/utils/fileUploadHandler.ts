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
export const upload = (childDir: string) => {
    const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = path.join(dest, childDir);

            // Create the child directory if it doesn't exist
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
        storage: storage,
        fileFilter: (req, file, cb) => {
            const filetypes = /pdf|doc|docx/;
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
