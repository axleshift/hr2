import mongoose from "mongoose";

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
        },
        username: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        emailVerifiedAt: {
            type: Date,
            required: false,
        },
        role: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            required: true,
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
