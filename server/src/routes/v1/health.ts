import { Router } from "express";
const router = Router();

import dotenv from "dotenv";
dotenv.config();

router.get("/", (req, res) => {
    res.send("OK");
});

export default {
    metadata: {
        path: "/health",
        method: ["GET"],
        description: "Health route",
        permissions: ["admin", "user", "guest"],
    },
    router,
};
