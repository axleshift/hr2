import exp from "constants";
import mongoose from "mongoose";

const jobposterSchema = new mongoose.Schema({
  ref_id: {
    type: String,
    required: true,
  },
  platform: {
    type: String,
    required: true,
  },
  isPosted: {
    type: Boolean,
    required: true,
  },
  post_id: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: false,
  },
  status: {
    type: String,
    enum: ["active", "inactive", "expired"],
    required: true,
  },
});

export default mongoose.model("Jobposter", jobposterSchema);
