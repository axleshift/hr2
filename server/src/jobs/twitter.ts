import { TwitterApi } from "twitter-api-v2";
import mongoose from "mongoose";
import JobPosting from "../database/models/jobpostingModel";
import dotenv from "dotenv";
dotenv.config();

const client = new TwitterApi({
  appKey: process.env.TWITTER_API_KEY,
  appSecret: process.env.TWITTER_API_SECRET_KEY,
  accessToken: process.env.TWITTER_ACCESS_TOKEN,
  accessSecret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});
const readOnlyClient = client.readOnly;

const formatSalary = (number: number) => {
  return number.toLocaleString("en-US", {
    style: "currency",
    currency: "PHP",
  });
};

mongoose
  .connect(process.env.MONGODB_URI!)

  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection error:", error));

const postRandomTweet = async () => {
  try {
    const res = await JobPosting.aggregate([{ $sample: { size: 1 } }]);
    const jobposting = res[0];
    // console.log(jobposting);

    const content =
      "Hiring for " +
      jobposting.title +
      "!" +
      "\n" +
      jobposting.type +
      "\n" +
      "=======================" +
      "\n" +
      "Location: " +
      jobposting.location +
      "\n" +
      "Salary: " +
      formatSalary(jobposting.salary_min) +
      " - " +
      formatSalary(jobposting.salary_max);

    client.v2
      .tweet(content)
      .then(() => {
        console.log("Tweet posted successfully");
      })
      .catch((error) => {
        console.error("Error posting tweet:", error);
      });
  } catch {
    console.log("Error fetching jobposting");
  }
};

postRandomTweet();
