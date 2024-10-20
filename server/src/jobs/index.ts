import fs from "fs";
import path from "path";
import logger from "../middlewares/logger";

const currentDir = __dirname;

const jobFiles = fs.readdirSync(currentDir).filter((file) => {
    return file.endsWith(".ts") || (file.endsWith(".js") && file !== "index.ts") || file !== "index.js";
});

const jobModules = jobFiles.map((file) => {
    const modulePath = path.join(currentDir, file);
    return import(modulePath);
});

const startJobs = async () => {
    try {
        const modules = await Promise.all(jobModules);
        for (const module of modules) {
            const m = module.default;
            if (typeof m.run === "function") {
                logger.info(`🤖 Running job: ${m.metadata.name}`);
                await m.run();
            }
        }
    } catch (error) {
        logger.error("Error running jobs:", error);
    }
};

export default startJobs;
