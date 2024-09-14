import mongoose from "mongoose";
import dotenv from "dotenv";
import { faker } from "@faker-js/faker";
import JobPosting from "../models/jobpostingModel";

dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI!)

  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

// const randomStatus = () => {
//   const statusArr = ["active", "inactive"];
//   const rand = Math.floor(Math.random() * statusArr.length);
//   return statusArr[rand];
// };

const randomJobType = () => {
  const jobTypeArr = ["full-time", "part-time", "contract", "internship"];
  const rand = Math.floor(Math.random() * jobTypeArr.length);
  return jobTypeArr[rand];
};

const createFakeJobPosting = () => {
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
    facebook: faker.datatype.boolean(),
    twitter: faker.datatype.boolean(),
  };
};

// Seed the database
const multiplier = 100;
const seedJobposting = async () => {
  try {
    await JobPosting.deleteMany();
    const fakeJobPostings = Array.from(
      { length: multiplier },
      createFakeJobPosting
    );
    await JobPosting.insertMany(fakeJobPostings);
    console.log("Jobposting seeded successfully!");
    mongoose.connection.close();
    return true;
  } catch (error) {
    console.error("Error seeding Jobposting:", error);
    mongoose.connection.close();
    return false;
  }
};
export default seedJobposting;
