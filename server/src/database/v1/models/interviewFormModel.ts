import mongoose, { Schema, Document } from 'mongoose';

const INTERVIEW_TYPES = [
  'Phone',
  'Video',
  'In-Person'
]

interface IInterviewForm extends Document {
  applicant: mongoose.Types.ObjectId,
  date: Date,
  interviewer: mongoose.Types.ObjectId,
  type: 'Phone' | 'Video' | 'In-Person'
  event: mongoose.Types.ObjectId,
  general: {
    communication: number,
    technical: number,
    problemSoving: number,
    culturalFit: number,
    workExperienceRelevance: number,
    leadership: number,
  },

  questions: mongoose.Types.ObjectId[],

  strength: string,
  weakness: string,

  recommendation: 'yes' | 'no' | 'need further review'
  finalComments: string,
}

const interviewFormSchema = new Schema<IInterviewForm>(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applicants'
    },
    date: {
      type: Date,
      default: () => new Date(),
    },
    interviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
    type: {
      type: String,
      enum: INTERVIEW_TYPES,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'facilityEvents'
    },

    general: {
      communication: {
        type: Number,
        default: 1
      },
      technical: {
        type: Number,
        default: 1
      },
      problemSoving: {
        type: Number,
        default: 1
      },
      culturalFit: {
        type: Number,
        default: 1
      },
      workExperienceRelevance: {
        type: Number,
        default: 1
      },
      leadership: {
        type: Number,
        default: 1
      },
    },

    questions: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'InterviewQuestions'
      }
    ],

    strength: {
      type: String,
    },
    weakness: {
      type: String,
    },
    recommendation: {
      type: String,
    },
    finalComments: {
      type: String,
    }
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IInterviewForm>('InterviewForm', interviewFormSchema);