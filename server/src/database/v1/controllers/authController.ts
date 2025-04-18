import { hasher } from "../../../utils/hasher";
import { Request as req, Response as res } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../../config";
import dotenv from "dotenv";
import logger from "../../../middlewares/logger";
import { oauth2Client } from "../../../config/v1/google";
import { google } from 'googleapis';
import userModel from "../models/userModel";
dotenv.config();

const salt = bcrypt.genSaltSync(10);

export const createUser = async (req: req, res: res) => {
  const { firstname, lastname, email, username, password } = req.body;
  if (!firstname || !lastname || !email || !username || !password) {
    return res.status(400).json({
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
      message: "User created successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({

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
        message: "User not found",
      });
    }
    const userPass = user.password as string
    const isPasswordValid = bcrypt.compareSync(password, userPass);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const jwtSecret = config.server.jwt.secret as string;
    const token: string = jwt.sign({ username, id: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    const userID = user._id.toString() as string;

    const userData = {
      _id: userID,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      role: user.role,
      email: user.email,
      status: user.status,
      token,
      emailVerifiedAt: user.emailVerifiedAt || null,
    };

    // ✅ Regenerate session to prevent fixation attack
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({
          message: "Error regenerating session",
        });
      }

      req.session.user = userData;
      req.session.save((saveErr) => {
        if (saveErr) {
          return res.status(500).json({
            message: "Error saving session",
          });
        }

        res.status(200).json({
          message: "User logged in successfully",
          data: userData,
        });
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({

      message: "Error logging in",
      error,
    });
  }
};

export const verify = async (req: req, res: res) => {
  try {
    const user = req.session.user;
    if (user) {
      res.status(200).json({
        message: "User verified successfully",
        data: user,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({

      message: "Error verifying user",
      error,
    });
  }
};

export const logout = async (req: req, res: res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Error destroying session",
      });
    }

    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: config.env === "production", // Only use secure cookies in production
      sameSite: "strict",
    });

    res.status(200).json({
      message: "Logged out successfully",
    });
  });
};


export const verifyEmail = async (req: req, res: res) => {
  try {
    const id = req.params.id;
    const code = req.query.code as string;

    if (!id || !code) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const user = await User.findById(id);

    // check if user exists
    if (!user) {
      return res.status(404).json({
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
        message: "Email verified successfully",
        data: updated,
      });
    } else {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error verifying email",
      error,
    });
  }
};

export const googleAuth = async (req:req, res:res) => {
  try {
    const scopes = ['profile', 'email'];
    const url = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
    });
    res.redirect(url);
  } catch (error) {
    console.error(500)
    res.status(500).json({ message: error})
  }  
}

export const googleCallback = async (req: req, res: res) => {
  try {
    const code = req.query.code as string;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);
  
    const oauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const userInfo = await oauth2.userinfo.get();
    const googleUser = userInfo.data;
  
    let user = await userModel.findOne({ googleId: googleUser.id})

    if (!user) {
      user = new userModel({
        googleId: googleUser.id,
        email: googleUser.email,
        name: googleUser.name,
        firstname: googleUser.given_name || 'Google',
        lastname: googleUser.family_name || 'User',
        username: googleUser.email?.split('@')[0] || `user${Date.now()}`,
        role: 'user',
        status: 'active',
        emailVerifiedAt: new Date(),
      });
      await user.save();
    }
    
    req.session.user = {
      _id: user._id.toString(),
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      role: user.role,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt,
    };

    const url = config.google.oauth2.clientRedirect as unknown as string
    
    if (!url) {
      console.error("Missing Google OAuth client redirect URL");
      return res.status(500).json({ message: "Missing redirect URL" });
    }
    
    res.redirect(url);
    
  } catch (error) {
    console.error(500)
    res.status(500).json({ message: error})
  }
}