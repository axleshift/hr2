import mongoose from "mongoose";
import dotenv from "dotenv";
import { config } from "../config";
import logger from "../middlewares/logger";

dotenv.config();

// Connect to MongoDB
export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoDbUri);
        logger.info("Connected to MongoDB");
    } catch (error) {
        logger.error("MongoDB connection error:", error);
    }
};
