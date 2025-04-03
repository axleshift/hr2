import mongoose, { Schema, Document } from 'mongoose';

const INTERVIEW_TYPES = ['Phone', 'Video', 'In-Person'];

interface IInterviewForm extends Document {
  applicant: mongoose.Types.ObjectId;
  date: Date;
  interviewer: mongoose.Types.ObjectId;
  type: 'Phone' | 'Video' | 'In-Person';
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
  strength: string;
  weakness: string;
  recommendation: 'yes' | 'no' | 'need further review';
  finalComments: string;
}

const interviewFormSchema = new Schema<IInterviewForm>(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applicants',
      required: true,
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
      enum: INTERVIEW_TYPES,
      default: 'Phone',
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
    strength: { type: String, default: '' },
    weakness: { type: String, default: '' },
    recommendation: {
      type: String,
      enum: ['yes', 'no', 'need further review'],
      default: 'need further review',
    },
    finalComments: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model<IInterviewForm>('InterviewForm', interviewFormSchema);
