import fs from "fs";
import path from "path";
import multer from "multer";
import { config } from "../config";

const dest = path.join(config.resumes.fsDir, "uploads");

// if uploads directory doesn't exist, create it
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

// setup storage engine for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname.replace(/\s/g, "-").toLowerCase()}`
    );
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error("File type not supported"));
    }
  },
});

export { upload };
