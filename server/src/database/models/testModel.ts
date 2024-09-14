import mongoose from "mongoose";
const testSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    repetition: {
      type: Number,
    },
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("Test", testSchema);
