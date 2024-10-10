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
        color: {
            type: String,
            // default to random color
            default: "#000000".replace(/0/g, () => (~~(Math.random() * 16)).toString(16)),
        }
    },
    {
        timestamps: true,
        updateAt: true,
    }
);

export default mongoose.model("Tags", tagSchema);
