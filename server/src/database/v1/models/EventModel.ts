import mongoose, { Schema, Document } from 'mongoose';

// I hate that I need to do this
interface IFacilityEvent extends Document {
  name: string;
  author: mongoose.Types.ObjectId;
  type: 'Initial Interview' | 'Final Interview' | 'Other';
  description?: string;
  date: Date;
  isAvailable: boolean;
  isApproved: {
    status: boolean;
    approvedBy: mongoose.Types.ObjectId;
  };
  capacity: number;
  participants: mongoose.Types.ObjectId[];
  facility: mongoose.Types.ObjectId;
  timeslot: mongoose.Types.ObjectId;
  emailSent: {
    status: boolean;
    history: mongoose.Types.ObjectId[];
  };
}

const facilityEventsSchema = new Schema<IFacilityEvent>(
  {
    name: {
      type: String,
      required: true
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    type: {
      type: String,
      enum: ['Initial Interview', 'Final Interview', 'Other'],
      default: 'Other'
    },
    description: {
      type: String
    },
    date: {
      type: Date,
      required: true
    },
    isAvailable: {
      type: Boolean,
      default: true
    },
    isApproved: {
      status: {
        type: Boolean,
        default: false
      },
      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
      },
    },
    capacity: {
      type: Number,
      required: true
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'applicants'
      }
    ],
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'facilities',
      required: true
    },
    timeslot: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: 'times'
    },
    emailSent: {
      status: {
        type: Boolean,
        default: false
      },
      history: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'emails'
        }
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFacilityEvent>('facilityEvents', facilityEventsSchema);
