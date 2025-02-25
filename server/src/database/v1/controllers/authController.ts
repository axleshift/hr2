import { hasher } from "../../../utils/hasher";
import { Request as req, Response as res } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../../config";
import dotenv from "dotenv";
import logger from "../../../middlewares/logger";
dotenv.config();

const salt = bcrypt.genSaltSync(10);

export const createUser = async (req: req, res: res) => {
  const { firstname, lastname, email, username, password } = req.body;
  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(400).json({
      statusCode: 400,
      success: false,
      message: "Please provide all required fields",
    });
  }

  try {
    // const user = await User.create({
    //     firstname: await hasher(firstname, salt),
    //     lastname: await hasher(lastname, salt),
    //     email,
    //     username,
    //     password: await hasher(password, salt),
    //     rememberToken: salt,
    // });

    const generateVerificationCode = () => {
      const code = Math.floor(100000 + Math.random() * 900000);
      // 5 minutes
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      return { code, expiresAt };
    };

    const user = await User.create({
      firstname,
      lastname,
      email,
      emailVerifiedAt: null,
      verification: {
        code: generateVerificationCode().code,
        expiresAt: generateVerificationCode().expiresAt,
      },
      username,
      password: await hasher(password, salt),
      rememberToken: salt,
    });

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error creating user",
      error,
    });
  }
};

export const login = async (req: req, res: res) => {
  const { username, password } = req.body;
  logger.info(`User ${username} is trying to login`);
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        error: "User not found",
      });
    }

    const storedHashedPassword = user.password;
    const isPasswordValid = bcrypt.compareSync(password, storedHashedPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid credentials",
      });
    }
    const jwtSecret = config.server.jwt.secret as string;
    const token: string = jwt.sign({ username, password }, jwtSecret, {
      expiresIn: "1h",
    });

    const data = {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      role: user.role,
      email: user.email,
      status: user.status,
      token: token,
      emailVerifiedAt: user.emailVerifiedAt || null,
    };
    req.session.user = data;
    req.session.save((err) => {
      if (err) {
        return res.status(500).json({
          statusCode: 500,
          success: false,
          message: "Error saving session",
        });
      }
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "User verified successfully",
        data,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error verifying user",
      error,
    });
  }
};

export const verify = async (req: req, res: res) => {
  try {
    const user = req.session.user;
    if (user) {
      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "User verified successfully",
        data: user,
      });
    } else {
      res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error verifying user",
      error,
    });
  }
};

export const logout = async (req: req, res: res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        statusCode: 500,
        success: false,
        message: "Error destroying session",
        error: err,
      });
    }
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Session destroyed successfully",
    });
  });
};

export const verifyEmail = async (req: req, res: res) => {
  try {
    const id = req.params.id;
    const code = req.query.code as string;

    if (!id || !code) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Please provide all required fields",
      });
    }

    const user = await User.findById(id);

    // check if user exists
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "User not found",
      });
    }

    // if code is correct & expiration, if both are satisfied update emailVerifiedAt and status to active
    if (user.verification && user.verification.code === code && new Date() < user.verification.expiresAt) {
      const updated = await User.findByIdAndUpdate(id, {
        status: "active",
        emailVerifiedAt: new Date(),
      });

      res.status(200).json({
        statusCode: 200,
        success: true,
        message: "Email verified successfully",
        data: updated,
      });
    } else {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Invalid or expired verification code",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error verifying email",
      error,
    });
  }
};
