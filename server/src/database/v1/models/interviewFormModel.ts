import mongoose, { Schema, Document } from 'mongoose';

const INTERVIEW_MODE_TYPES = ['Phone', 'Video', 'In-Person'];
const RECO_STATUS = ['yes', 'no', 'need further review']

interface IInterviewForm extends Document {
  applicant: mongoose.Types.ObjectId;
  // job: mongoose.Types.ObjectId;
  job: string;
  date: Date;
  interviewer: mongoose.Types.ObjectId;
  type: 'Phone' | 'Video' | 'In-Person';
  interviewType: string;
  event: mongoose.Types.ObjectId;
  general: {
    communication: number;
    technical: number;
    problemSolving: number;
    culturalFit: number;
    workExperienceRelevance: number;
    leadership: number;
  };
  questions: {
    question: string;
    remark: string;
  }[];
  salaryExpectation: number;
  strength: string;
  weakness: string;
  isReviewed: {
    status: boolean,
    by: mongoose.Types.ObjectId,
  }
  recommendation: 'yes' | 'no' | 'need further review';
  finalComments: string;
}

const interviewFormSchema = new Schema<IInterviewForm>(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applicant',
      required: true,
    },
    // job: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Job',
    // },
    job: {
      type: String,
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
      required: true,
    },
    type: {
      type: String,
      enum: INTERVIEW_MODE_TYPES,
      default: 'Phone',
    },
    interviewType: {
      type: String,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'facilityEvents',
    },
    general: {
      communication: { type: Number, default: 1 },
      technical: { type: Number, default: 1 },
      problemSolving: { type: Number, default: 1 }, // Fixed typo
      culturalFit: { type: Number, default: 1 },
      workExperienceRelevance: { type: Number, default: 1 },
      leadership: { type: Number, default: 1 },
    },
    questions: [
      {
        question: { type: String, required: true },
        remark: { type: String, default: '' },
      },
    ],
    salaryExpectation: {
      type: Number,
      default: 0,
    },
    strength: { type: String, default: '' },
    weakness: { type: String, default: '' },
    recommendation: {
      type: String,
      enum: RECO_STATUS,
      default: 'need further review',
    },
    isReviewed: {
      status: {
        type: Boolean,
        default: false,
      },
      by: {
        type: mongoose.Types.ObjectId,
      }
    },
    finalComments: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IInterviewForm>('InterviewForm', interviewFormSchema);
