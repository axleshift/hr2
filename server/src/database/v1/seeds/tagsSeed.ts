import Tag from "../models/tagModel";
import logger from "../../../middlewares/logger";
import { faker } from "@faker-js/faker";

const tagNameArr = ["top candidate", "qualified", "unqualified", "potential", "rejected", "needs review"];

const seedTags = async () => {
    try {
        // delete all tags
        await Tag.deleteMany();
        logger.info("All tags deleted");

        const tags = tagNameArr.map((name) => ({
            name,
            category: "applicant",
            description: faker.lorem.sentence(),
        }));

        await Tag.insertMany(tags);
        logger.info("Tags seeded successfully");
    } catch (err) {
        logger.error("Error seeding tags:", err);
    }
};

export default seedTags;
