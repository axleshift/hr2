import jwt from "jsonwebtoken";
import { Document, Types } from "mongoose";
import { hasher } from "../../utils/hasher";

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
const createUser = async (req: any, res: any, next: any) => {
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
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
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
const verifyUser = async (req: any, res: any, next: any) => {
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
        message: "Invalid credentials",
      });
    }
    const hashedPassword = await hasher(password, storedSalt);
    const token = jwt.sign({ username }, process.env.JWT_SECRET || "", {
      expiresIn: "24h",
    });

    const isPasswordValid = hashedPassword === storedHashedPassword;
    if (!isPasswordValid) {
      return res.status(401).json({
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

    res.status(200).json({
      status: 200,
      message: "User verified successfully",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error verifying user",
      error,
    });
  }
};

/**
 * Verifies the validity of a JWT token.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object.
 * @param next - The next middleware function.
 * @returns - If the token is valid, a 200 status response with a "Authenticated" message. If the token is invalid, a 401 status response with an "Invalid credentials" message. If an error occurs, a 500 status response with an "Internal Server Error" message.
 */
const checkToken = async (req: any, res: any, next: any) => {
  const token = req.body.token;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
    if (decodedToken) {
      res.status(200).json({ status: 200, message: "Authenticated" });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Error executing query:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createUser, verifyUser, checkToken };
