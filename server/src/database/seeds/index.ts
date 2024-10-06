import fs from "fs";
import path from "path";
import logger from "../../middlewares/logger";
import { connectDB } from "../connectDB";
import mongoose from "mongoose";
const currentDir = __dirname;

connectDB();

const seedFiles = fs.readdirSync(currentDir).filter((file) => {
    return ((file.endsWith(".ts") && file !== "index.js") || file.endsWith(".js")) && file !== "index.ts";
});

const seedModules = seedFiles.map((file) => {
    const modulePath = path.join(currentDir, file);
    return import(modulePath);
});

const runSeeds = async () => {
    try {
        const modules = await Promise.all(seedModules);
        for (const module of modules) {
            if (typeof module.default === "function") {
                logger.info(`Running seed: ${module.default.name}`);
                await module.default();
            } else {
                logger.warn(`No default function found in ${module.default}`);
            }
        }
        logger.info("All seeds ran successfully");
        mongoose.connection.close();
    } catch (error) {
        logger.error("Error running seeds:", error);
        mongoose.connection.close();
    }
};

runSeeds();
