import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    authority: {
        type: String,
        required: true,
    },
    year: {
        type: String,
        required: true,
    },
});

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
            type: [certificationSchema],
            required: true,
        },
        tags: {
            type: [String],
            required: true,
        },
        remarks: {
            type: String,
        },
        resumeFileLoc: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            required: true,
            default: new Date().setDate(new Date().getDate() + 7),
        },
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("Applicant", applicantSchema);
