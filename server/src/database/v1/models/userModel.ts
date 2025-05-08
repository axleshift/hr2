import mongoose, { Document, Types } from "mongoose";

export interface IUserBase{
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  password?: string;
  emailVerifiedAt?: Date;
  verification?: IVerification;
  role: string;
  status: string;
  suspension: {
    status: boolean;
    reason?: string;
    expiresAt?: Date;
  };
  rememberToken?: string;
  otp: IOtp | null;
  knownDevices: string[];
  googleId?: string; // Google OAuth ID
  displayName?: string; // Google display name
  googleEmail?: string; // Google email
  googleAvatar?: string; // Google avatar URL (optional)
}

export interface IVerification extends Document {
  code: string;
  expiresAt: Date;
}

export interface IUser extends IUserBase, Document {
  _id: Types.ObjectId,
}

export interface IOtp {
  code: string;
  expiresAt: Date;
}

const verificationSchema = new mongoose.Schema<IVerification>({
  code: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    required: true,
  },
});

const OtpSchema = new mongoose.Schema<IOtp>({
  code: {
    type: String,
  },
  expiresAt: {
    type: Date
  }
})

const userSchema = new mongoose.Schema<IUserBase>(
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
      required: false, // Password is optional for Google users
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
      default: "User",
    },
    status: {
      type: String,
      default: "inactive",
    },
    suspension: {
      status: {
        type: Boolean,
        default: false,
      },
      reason: {
        type: String,
      },
      expiresAt: {
        type: Date,
      },
    },
    rememberToken: {
      type: String,
      required: false,
    },
    otp: {
      type: OtpSchema
    },
    knownDevices: [{
      type: String,
    }],
    // Google-related fields
    googleId: {
      type: String,
      required: false, // Not required unless the user logged in with Google
    },
    displayName: {
      type: String,
      required: false, // Not required unless the user logged in with Google
    },
    googleEmail: {
      type: String,
      required: false, // Not required unless the user logged in with Google
    },
    googleAvatar: {
      type: String,
      required: false, // Optional avatar URL for Google users
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IUserBase>("User", userSchema);
