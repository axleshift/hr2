import Tag from "../models/tagModel";
import logger from "../../middlewares/logger";
import { faker } from "@faker-js/faker";
import Interview from "../models/interviewModel";

const seedInterviews = async () => {
    try {
        // delete all interviews
        await Interview.deleteMany();
        logger.info("All interviews deleted");

        // const interviews = Array.from({ length: 10 }, () => ({
        //     applicant: faker.name.findName(),
        //     interviewer: faker.name.findName(),
        //     date: faker.date.recent(),
        //     time: faker.date.recent(),
        //     status: faker.random.arrayElement(["pending", "accepted", "rejected"]),
        //     tag: faker.random.arrayElement(["top candidate", "qualified", "unqualified", "potential", "rejected", "needs review"]),
        //     feedback: faker.lorem.sentence(),
        // }));

        await Interview.insertMany(interviews);
        logger.info("Interviews seeded successfully");
    } catch (error) {
        logger.error("Error seeding interviews:", error);
    }
};

export default seedInterviews;
