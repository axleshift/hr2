import mongoose, { Schema, Document } from 'mongoose';

const OFFER_STATUSES = ['Pending', 'Accepted', 'Declined'];

interface IJobOfferForm extends Document {
  applicant: mongoose.Types.ObjectId;
  position: mongoose.Types.ObjectId | string | null;
  salary: number;
  startDate: Date;
  benefits: string;
  status: 'Pending' | 'Accepted' | 'Declined';
  issuedBy: mongoose.Types.ObjectId;
  issuedDate: Date;
  approvedBy: mongoose.Types.ObjectId;
  approvedDate: Date;
  responseDate: Date;
  emailsent: boolean;
  emailSentDate: Date;
  expires: Date;
  notes: string;
}

const jobOfferFormSchema = new Schema<IJobOfferForm>(
  {
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Applicant',
      required: true,
    },
    position: {
      type: Schema.Types.Mixed,
      validate: {
        validator(value) {
          return mongoose.Types.ObjectId.isValid(value) || typeof value === 'string';
        },
        message: 'Author must be a valid ObjectId or a string.',
      },
    },
    salary: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    benefits:
    {
      type: String,
    },
    status: {
      type: String,
      enum: OFFER_STATUSES,
      default: 'Pending',
    },
    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    issuedDate: {
      type: Date,
      default: () => new Date(),
    },
    responseDate: {
      type: Date,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    approvedDate: {
      type: Date,
    },
    emailsent: {
      type: Boolean,
    },
    emailSentDate: {
      type: Date,
    },
    expires: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJobOfferForm>('JobOfferForm', jobOfferFormSchema);
