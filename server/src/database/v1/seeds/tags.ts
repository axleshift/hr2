import tagModel from "../models/tagModel";
import logger from '../../../middlewares/logger';

const tags  = [
  {
    name: "Screening",
    category: "Applicant",
    description: "Set applicant as status of screening",
    color: "#000000",
    isProtected: true,
    isSystem: true,
  },
  {
    name: "Interview",
    category: "Applicant",
    description: "Set applicant as status of interview",
    color: "#000000",
    isProtected: true,
    isSystem: true,
  },
  {
    name: "Training",
    category: "Applicant",
    description: "Set applicant as status of training",
    color: "#000000",
    isProtected: true,
    isSystem: true,
  },
  {
    name: "Shortlisted",
    category: "Applicant",
    description: "Set applicant as status of shortlisted",
    color: "#000000",
    isProtected: true,
    isSystem: true,
  },
  {
    name: "Rejected",
    category: "Applicant",
    description: "Set applicant as status of rejected",
    color: "#000000",
    isProtected: true,
    isSystem: true,
  }
]

const seedTag = async () => {
  try {
    await tagModel.deleteMany();
    await tagModel.insertMany(tags);
    return true;
  } catch (error) {
    logger.error(error);
    return false;
  }
};

export default {
  metadata: {
    name: "tags",
    description: "This seed is used to add default tags",
  },
  run: seedTag,
}