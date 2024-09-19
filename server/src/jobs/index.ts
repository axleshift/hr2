// Import jobs
import logger from "../middleware/logger";
import removeExpiredJobposters from "./jobposterCleanup";

const startJobs = () => {
  // Start the expired job poster removal cron job
  removeExpiredJobposters();
  logger.info("Jobs started");
};

export default startJobs;
