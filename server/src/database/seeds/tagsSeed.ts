import mongoose from "mongoose";
import Tag from "../models/tagModel";
import logger from "../../middleware/logger";
import { config } from "../../config";

// Connect to MongoDB
mongoose
  .connect(config.mongoDbUri!)
  .then(() => logger.info("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const tagNameArr = [
  "top candidate",
  "qualified",
  "unqualified",
  "potential",
  "rejected",
  "needs review",
];

const seedTags = async () => {
  try {
    // delete all tags
    await Tag.deleteMany();
    logger.info("All tags deleted");

    const tags = tagNameArr.map((name) => ({
      name,
      category: "applicant",
    }));

    await Tag.insertMany(tags);
    logger.info("Tags seeded successfully");
  } catch (err) {
    logger.error("Error seeding tags:", err);
  } finally {
    mongoose.connection.close();
  }
};

seedTags();
