import mongoose from "mongoose";
const userSettingsSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
        },
        theme: {
            type: String,
            default: "light",
        },
        toast: {
            duration: {
                type: Number,
                default: 5000,
            },
        },
        email_notifications: {
            type: Boolean,
            default: true,
        },
        push_notifications: {
            type: Boolean,
            default: true,
        },
        developer: {
            status: {
                type: Boolean,
                default: false,
            }, 
            api_key: {
                type: String,
            },
        }
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("UserSettings", userSettingsSchema);
