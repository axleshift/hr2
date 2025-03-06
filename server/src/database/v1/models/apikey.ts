import mongoose from "mongoose";
const apiKeySchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
    },
    permissions: {
      type: Array,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("Test", apiKeySchema);
