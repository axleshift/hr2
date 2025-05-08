import mongoose, { Schema, Document } from 'mongoose';

const OFFER_STATUSES = ['Pending', 'Accepted', 'Declined'];
const JOB_TYPES = ['Contractual', 'Regular', 'Temporary', 'Freelance']; // New Enum for job types

interface IJobOfferForm extends Document {
  applicant: mongoose.Types.ObjectId;
  position: mongoose.Types.ObjectId | string | null;
  salary: number;
  startDate: Date;
  benefits: string;
  salaryType: 'Hourly' | 'Annual';
  contractDuration: string | null;
  location: string;
  workHours: string;
  jobType: 'Contractual' | 'Regular' | 'Temporary' | 'Freelance'; // New field for job type
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
  probationPeriod: string | null;
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
        message: 'Position must be a valid ObjectId or a string.',
      },
    },
    salary: {
      type: Number,
      required: true,
    },
    salaryType: {
      type: String,
      enum: ['Hourly', 'Annual'],
      default: 'Annual',
    },
    startDate: {
      type: Date,
      required: true,
    },
    benefits: {
      type: String,
    },
    contractDuration: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      required: true,
    },
    workHours: {
      type: String,
    },
    jobType: {
      type: String,
      enum: JOB_TYPES,
      required: true, // This field is now required
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
      default: false,
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
    probationPeriod: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IJobOfferForm>('JobOfferForm', jobOfferFormSchema);
