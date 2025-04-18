import { Request as req, Response as res } from "express";

import apiKey from "../models/apikeyModel";
import logger from "../../../middlewares/logger";

export const generateApikey = async (req: req, res: res) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "User not authenticated",
      });
    }

    const userId = req.session.user?._id
    const apiKeyData = await apiKey.find({ owner: userId });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: apiKeyData,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateApikey = async (req: req, res: res) => {
  try {
    const { permissions, expiresAt } = req.body;
    const { id } = req.params;

    const apiKeyData = await apiKey.findById(id);

    if (!apiKeyData) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "API key not found",
      });
    }

    apiKeyData.permissions = permissions;
    apiKeyData.expiresAt = expiresAt;

    await apiKeyData.save();

    return res.status(200).json({
      statusCode: 200,
      success: true,
      message: "API key updated successfully",
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

export const createApikey = async (req: req, res: res) => {
  try {
    const { permissions, expiresAt } = req.body;
    const key = Math.random().toString(36).substring(7);

    const userId = req.session.user?._id

    const apiKeyData = await apiKey.create({
      key: key,
      owner: req.user ? userId : undefined,
      permissions: permissions || [],
      expiresAt: expiresAt || new Date(),
    });

    return res.status(201).json({
      statusCode: 201,
      success: true,
      message: "API key created successfully",
      data: apiKeyData,
    });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
};
