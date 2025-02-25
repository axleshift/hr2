import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import JobPosting from "../models/jobposting";
import JobPoster from "../models/jobposter";
import logger from "../../../middlewares/logger";

dotenv.config();

const randomJobType = () => {
  const jobTypeArr = ["full-time", "part-time", "contract", "internship"];
  const rand = Math.floor(Math.random() * jobTypeArr.length);
  return jobTypeArr[rand];
};

const createFakeJobPosting = async () => {
  return {
    title: faker.person.jobTitle(),
    type: randomJobType(),
    // company: faker.company.name(),
    salary_min: faker.helpers.rangeToNumber({ min: 30000, max: 100000 }),
    salary_max: faker.helpers.rangeToNumber({ min: 40000, max: 100000 }),
    location: faker.location.city(),
    // status: randomStatus(),
    description: faker.lorem.paragraphs(2),
    requirements: faker.lorem.sentences(3),
    responsibilities: faker.lorem.sentences(3),
    benefits: faker.lorem.sentences(2),
    status: "inactive",
    schedule_start: faker.date.soon(),
    schedule_end: faker.date.future(),
    isExpired: false,
  };
};

// Seed the database
const multiplier = 100;
const seedJobposting = async () => {
  try {
    await JobPosting.deleteMany();
    await JobPoster.deleteMany();
    const req = await createFakeJobPosting();
    // console.log(req);
    const fakeJobPostings = await Promise.all(Array.from({ length: multiplier }).map(() => req));
    await JobPosting.insertMany(fakeJobPostings);
    logger.info(`Seeded ${multiplier} job postings`);
    return true;
  } catch (error) {
    logger.error("Error seeding job postings:", error);
    return false;
  }
};
export default {
  metadata: {
    name: "jobpostings",
    description: "This seed is used to add default job postings",
  },
  run: seedJobposting,
};
