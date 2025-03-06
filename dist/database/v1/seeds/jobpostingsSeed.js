"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const faker_1 = require("@faker-js/faker");
const jobposting_1 = __importDefault(require("../models/jobposting"));
const jobposter_1 = __importDefault(require("../models/jobposter"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
dotenv_1.default.config();
const randomJobType = () => {
    const jobTypeArr = ["full-time", "part-time", "contract", "internship"];
    const rand = Math.floor(Math.random() * jobTypeArr.length);
    return jobTypeArr[rand];
};
const createFakeJobPosting = async () => {
    return {
        title: faker_1.faker.person.jobTitle(),
        type: randomJobType(),
        // company: faker.company.name(),
        salary_min: faker_1.faker.helpers.rangeToNumber({ min: 30000, max: 100000 }),
        salary_max: faker_1.faker.helpers.rangeToNumber({ min: 40000, max: 100000 }),
        location: faker_1.faker.location.city(),
        // status: randomStatus(),
        description: faker_1.faker.lorem.paragraphs(2),
        requirements: faker_1.faker.lorem.sentences(3),
        responsibilities: faker_1.faker.lorem.sentences(3),
        benefits: faker_1.faker.lorem.sentences(2),
        status: "inactive",
        schedule_start: faker_1.faker.date.soon(),
        schedule_end: faker_1.faker.date.future(),
        isExpired: false,
    };
};
// Seed the database
const multiplier = 100;
const seedJobposting = async () => {
    try {
        await jobposting_1.default.deleteMany();
        await jobposter_1.default.deleteMany();
        const req = await createFakeJobPosting();
        // console.log(req);
        const fakeJobPostings = await Promise.all(Array.from({ length: multiplier }).map(() => req));
        await jobposting_1.default.insertMany(fakeJobPostings);
        logger_1.default.info(`Seeded ${multiplier} job postings`);
        return true;
    }
    catch (error) {
        logger_1.default.error("Error seeding job postings:", error);
        return false;
    }
};
exports.default = {
    metadata: {
        name: "jobpostings",
        description: "This seed is used to add default job postings",
    },
    run: seedJobposting,
};
