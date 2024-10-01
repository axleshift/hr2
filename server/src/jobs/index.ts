import fs from "fs";
import path from "path";
import logger from "../middleware/logger";

const currentDir = __dirname;

const jobFiles = fs.readdirSync(currentDir).filter((file) => {
  return file.endsWith(".ts") && file !== "index.ts";
});

const jobModules = jobFiles.map((file) => {
  const modulePath = path.join(currentDir, file);
  return import(modulePath);
});

const startJobs = async () => {
  try {
    const modules = await Promise.all(jobModules);
    for (const module of modules) {
      if (typeof module.default === "function") {
        logger.info(`Running job: ${module.default.name}`);
        await module.default();
      }
    }
    logger.info("Jobs ran successfully");
  } catch (error) {
    logger.error("Error running jobs:", error);
  }
};

export default startJobs;
