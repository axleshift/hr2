import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    middlename: {
      type: String,
      required: false,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    portfolioURL: {
      type: String,
      required: true,
    },
    professionalSummary: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    // workExperience: {
    //   type: [
    //     {
    //       companyName: String,
    //       position: String,
    //       startDate: Date,
    //       endDate: Date,
    //       jobDescription: String,
    //     },
    //   ],
    //   required: true,
    // },
    workExperience: {
      type: String,
      required: true,
    },
    // education: {
    //   type: [
    //     {
    //       institutionName: String,
    //       degree: String,
    //       startDate: Date,
    //       endDate: Date,
    //       courses: [String],
    //     },
    //   ],
    //   required: true,
    // },
    education: {
      type: String,
      required: true,
    },
    certifications: {
      type: [String],
      required: true,
    },
    tags: {
      type: [String],
      required: true,
    },
    resumeFileLoc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("Applicant", applicantSchema);
