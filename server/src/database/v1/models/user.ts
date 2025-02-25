import mongoose from "mongoose";

const verificationSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const developerSchema = new mongoose.Schema(
  {
    apKey: {
      type: String,
      required: true,
    },
    permissions: {
      type: [String],
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

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerifiedAt: {
      type: Date,
      required: false,
    },
    verification: {
      type: verificationSchema,
      required: false,
    },
    role: {
      type: String,
      default: "user",
    },
    status: {
      type: String,
      default: "inactive",
    },
    rememberToken: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    updateAt: true,
  }
);

export default mongoose.model("User", userSchema);
