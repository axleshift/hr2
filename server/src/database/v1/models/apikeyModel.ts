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
      // this is the default expiration date with 1 year
      default: new Date().setFullYear(new Date().getFullYear() + 1), 
      required: true,
    },
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("Apikey", apiKeySchema);
