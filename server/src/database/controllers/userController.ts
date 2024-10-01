import jwt from "jsonwebtoken";
import { hasher } from "../../utils/hasher";
import { Request as req, Response as res } from "express";
import User from "../models/userModel";

import dotenv from "dotenv";
dotenv.config();

const salt = Math.random().toString(36).substring(2, 15);

/**
 * Creates a new user in the database.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is created.
 */
const createUser = async (req: req, res: res) => {
  const { firstname, lastname, email, username, password, status, role } =
    req.body;

  try {
    const user = await User.create({
      firstname: await hasher(firstname, salt),
      lastname: await hasher(lastname, salt),
      email,
      username,
      password: await hasher(password, salt),
      rememberToken: salt,
      status,
      role,
    });

    res.status(201).json({
      statusCode: 201,
      success: true,
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error creating user",
      error,
    });
  }
};

/**
 * Verifies a user's credentials and returns a JWT token if the credentials are valid.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next middleware function.
 * @returns {Promise<void>} - A promise that resolves when the user is verified.
 */
const verifyUser = async (req: req, res: res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const storedHashedPassword = user.password;
    const storedSalt = user.rememberToken;

    if (!storedHashedPassword || !storedSalt) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid credentials",
        error: "Invalid credentials",
      });
    }
    const hashedPassword = await hasher(password, storedSalt);
    const token = jwt.sign({ username }, process.env.JWT_SECRET || "", {
      expiresIn: "24h",
    });

    const isPasswordValid = hashedPassword === storedHashedPassword;
    if (!isPasswordValid) {
      return res.status(401).json({
        statusCode: 401,
        success: false,
        message: "Invalid credentials",
      });
    }
    const data = {
      username: user.username,
      role: user.role,
      email: user.email,
      status: user.status,
      token,
    };
    console.log(data);

    // Store the token in the session
    req.session.jwt = token;

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "User verified successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      statusCode: 500,
      success: false,
      message: "Error verifying user",
      error,
    });
  }
};

export { createUser, verifyUser };
