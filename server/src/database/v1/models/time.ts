import mongoose, { Schema, Document } from 'mongoose';

interface ITime extends Document {
  date: Date,
  facility: mongoose.Types.ObjectId,
  event: mongoose.Types.ObjectId,
  start: string,
  end: string,
  isAvailable: boolean,
}

const timeSchema = new Schema<ITime>(
  {
    date: {
      type: Date,
      required: true,
    },
    facility: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "facilities",
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "facilityEvents",
      required: false
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ITime>("Times", timeSchema);