import mongoose, { Schema, Document } from 'mongoose';

interface IInterviewQuestion extends Document {
  job: string,
  question: string,
  response: string,
  author: mongoose.Types.ObjectId,
  for: mongoose.Types.ObjectId,
}

const interviewQuestionSchema = new Schema<IInterviewQuestion>(
  {
    job: {
      type: String,
    },
    question: {
      type: String,
    },
    response: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users'
    },
    for: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InterviewForms'
    }
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IInterviewQuestion>('interviewQuestion', interviewQuestionSchema);
