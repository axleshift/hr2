import mongoose, { Schema, Document } from 'mongoose';
const EVENT_TYPES = ['Initial Interview', 'Final Interview', 'Technical Interview', 'Panel Interview', 'Behavioral Interview', 'Other'] as const;

interface IFacilityEvent extends Document {
  name: string;
  author: mongoose.Types.ObjectId;
  type: 'Initial Interview' | 'Final Interview' | 'Technical Interview' | 'Panel Interview' | 'Behavioral Interview' | 'Other';
  description?: string;
  date: Date;
  isAvailable: boolean;
  isApproved: {
    status: boolean;
    approvedBy: mongoose.Types.ObjectId;
  };
  capacity: number;
  participants: [
    {
      applicant: mongoose.Types.ObjectId;
      mail: {
        sent: boolean,
        reason: string,
      }
    }
  ];
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
      ref: 'User',
      required: true
    },
    type: {
      type: String,
      enum: EVENT_TYPES,
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
        ref: 'User',
      },
    },
    capacity: {
      type: Number,
      required: true
    },
    participants: [
      {
        applicant: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Applicant'
        },
        mail: {
          sent: {
            type: Boolean,
            default: false,
          },
          reason: {
            type: String
          }
        }
      }
    ],
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Facility',
      required: true
    },
    timeslot: {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: 'Timeslot'
    },
    emailSent: {
      status: {
        type: Boolean,
        default: false
      },
      history: [
        {
          date: {
            type: Date,
            default: () => new Date()
          },
          content: {
            type: String,
          }
        }
      ]
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IFacilityEvent>('FacilityEvent', facilityEventsSchema);
