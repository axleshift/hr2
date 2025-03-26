import mongoose from "mongoose";
const tagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: "General",
        },
        description: {
            type: String,
            required: false,
        },
        color: {
            type: String,
            // default to random color
            default: "#000000".replace(/0/g, () => (~~(Math.random() * 16)).toString(16)),
        },
        isProtected: {
            type: Boolean,
            default: false,
        },
        isSystem: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("Tag", tagSchema);
