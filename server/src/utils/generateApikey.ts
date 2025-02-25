/**
 * @file /utils/generateApikey.ts
 * @description Generates an API key
 */

import logger from "../middlewares/logger";
import apiKey from "../database/v1/models/apikey";

export const generateApikey = async () => {
    try {
        const key = Math.random().toString(36).substring(7);

        const apiKeyData = await apiKey.create({
            key: key,
            owner: "67aedc4d9126428016e044ac",
            permissions: ["admin"],
            expiresAt: new Date(),
        });
        return apiKeyData;
    } catch (error) {
        logger.error("Error generating API key:", error);
        throw new Error("Error generating API key");
    }
};
