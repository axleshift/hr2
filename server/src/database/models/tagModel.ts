import mongoose from "mongoose";
const tagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("Tags", tagSchema);
