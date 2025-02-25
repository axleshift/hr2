import { Request as res, Response as req } from "express";

import apiKey from "../models/apikey";

interface CustomRequest extends res {
  permissions?: string[];
  user?: { _id: string };
}

export const generateApikey = async (req: CustomRequest, res: req) => {
  try {
    if (!req.user) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "User not authenticated",
      });
    }
    const apiKeyData = await apiKey.find({ owner: req.user._id });

    return res.status(200).json({
      statusCode: 200,
      success: true,
      data: apiKeyData,
    });
  } catch (error) {
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

export const updateApikey = async (req: CustomRequest, res: req) => {
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
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
};

export const createApikey = async (req: CustomRequest, res: req) => {
  try {
    const { permissions, expiresAt } = req.body;
    const key = Math.random().toString(36).substring(7);

    const apiKeyData = await apiKey.create({
      key: key,
      owner: req.user ? req.user._id : undefined,
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
    return res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Internal server error",
    });
  }
};
