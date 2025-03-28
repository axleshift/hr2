import { Request as req, Response as res } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

export const getAllAccounts = async (req: req, res: res) => {
  try {
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
    const skip = (page - 1) * limit;
    const sortOrder = req.query.sort === "desc" ? -1 : 1;

    const totalItems = await User.find().countDocuments();
    const data = await User.find().sort({ createdAt: sortOrder }).skip(skip).limit(limit);

    if (data.length < 1) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "No accounts found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Accounts retrieved successfully",
      data,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error getting all accounts",
      error,
    });
  }
};

export const getAccountById = async (req: req, res: res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Please provide an id",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Account retrieved successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error getting account by id",
      error,
    });
  }
};

export const updateAccount = async (req: req, res: res) => {
  try {
    const id = req.params.id;
    const { firstname, lastname, email, username, password, role } = req.body;
    if (!id || !firstname || !lastname || !email || !username || !password || !role) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    const salt = user.rememberToken as string;
    const updated = await User.findByIdAndUpdate(id, {
      firstname,
      lastname,
      email,
      username,
      password: await bcrypt.hash(password, salt),
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Account updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error updating account",
      error,
    });
  }
};

export const activeAccount = async (req: req, res: res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;

    if (!id || !reason) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findByIdAndUpdate(id, {
      status: "active",
      emailVerifiedAt: new Date(),
    });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Account activated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error activating account",
      error,
    });
  }
};

export const deactivateAccount = async (req: req, res: res) => {
  try {
    const id = req.params.id;
    const { reason } = req.body;

    if (!id || !reason) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findByIdAndUpdate(id, {
      status: "inactive",
    });

    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Account deactivated successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error deactivating account",
      error,
    });
  }
};

export const generateNewVerificationCode = async (req: req, res: res) => {
  try {
    const id = req.params.id;
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const updated = await User.findByIdAndUpdate(id, {
      verification: {
        code,
        expiresAt,
      },
    });

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "New verification code generated successfully",
      data: updated,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error generating new verification code",
      error,
    });
  }
};
