import { hasher } from "../../../utils/hasher";
import { Request as req, Response as res } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import { config } from "../../../config";
import dotenv from "dotenv";
import logger from "../../../middlewares/logger";
import { oauth2Client } from "../../../config/v1/google";
import { google } from 'googleapis';
import userModel from "../models/userModel";
import { sendEmail } from "../../../utils/mailHandler";
import fs from "fs/promises"
import path from "path";

dotenv.config();

const salt = bcrypt.genSaltSync(10);

export const createUser = async (req: req, res: res) => {
  try {
    const { firstname, lastname, email, username, password } = req.body;
    if (!firstname || !lastname || !email || !username || !password) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

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
  try {
    const { username, password } = req.body;
    logger.info(`User ${username} is trying to login`);

    // Find user by username or email
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username);
    const user = await User.findOne(isEmail ? { email: username } : { username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const userPass = user.password?.toString() as string
    const isPasswordValid = bcrypt.compare(password, userPass);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create user session payload
    const userID = user._id.toString();
    const userData = {
      _id: userID,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      role: user.role,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt || null,
    };

    // Detect new device
    const userAgent = req.headers['user-agent'] || 'unknown';
    const userIP = req.ip || req.connection.remoteAddress || 'unknown';
    const deviceFingerprint = `${userAgent}-${userIP}`;
    const knownDevices = user.knownDevices || [];

    const templatePath = path.join(__dirname, '../../../public/templates/newDeviceAlert.html');
    const emailTemplate = await fs.readFile(templatePath, "utf-8");
    
    const emailText = emailTemplate
      .replace(/{{userAgent}}/g, userAgent)
      .replace(/{{userIP}}/g, userIP)
      .replace(/{{time}}/g, new Date().toLocaleString())

    const isNewDevice = !knownDevices.includes(deviceFingerprint);
    if (isNewDevice) {
      await sendEmail(
        'New Device Alert',
        user.email,
        'New Device Login',
        "",
        emailText
      )
      // user.knownDevices.push(deviceFingerprint);
      // await user.save();

      req.session.pendingDevice = deviceFingerprint;

      return res.status(200).json({
        message: "New Device detected, OTP verification is required.",
        data: userData,
        isKnownDevice: false,
      })
    }

    // Regenerate session
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ message: "Error regenerating session" });
      }

      req.session.user = userData;
      req.session.save((saveErr) => {
        if (saveErr) {
          return res.status(500).json({ message: "Error saving session" });
        }

        res.status(200).json({
          message: "User logged in successfully",
          data: userData,
          isKnownDevice: true,
        });
      });
    });

  } catch (error) {
    logger.error("Login error:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

export const sendOTP = async (req: req, res: res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // e.g., '489201'
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 min
    
    user.otp = {
      code: otp,
      expiresAt,
    };
    await user.save();

    const templatePath = path.join(__dirname, '../../../public/templates/otpEmail.html');
    const emailTemplate = await fs.readFile(templatePath, "utf-8");

    // Send OTP via email
    // const msg = `
    //   Your OTP for logging in is: ${otp}
    //   This OTP is valid for 10 minutes.
    // `;

    const userAgent = req.headers['user-agent'] || 'unknown';
    const userIP = req.ip || req.connection.remoteAddress || 'unknown';

    const emailText = emailTemplate
    .replace(/{{userName}}/g, username)
    .replace(/{{otp}}/g, otp)
    .replace(/{{ipAddress}}/g, userIP)
    .replace(/{{userAgent}}/g, userAgent)

    await sendEmail(
      'OTP Verification', 
      user.email, 
      'Your OTP', 
      '', 
      emailText
    );

    res.status(200).json({
      message: 'OTP sent successfully',
      redirectToOtpPage: true,
    });
    
  } catch (error) {
    logger.error(error)
    res.status(500).json({ message: "Error sending OTP", error})
  }
}

export const verifyOTP = async (req: req, res: res) => {
  try {
    const { username, otp } = req.body;

    if (!username || !otp) {
      return res.status(400).json({ message: 'Please provide username and OTP' });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if OTP is present and not expired
    if (!user.otp || new Date() > user.otp.expiresAt) {
      return res.status(400).json({ message: 'OTP expired or not sent' });
    }

    // Check if the OTP is correct
    if (user.otp.code !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP is valid, proceed with authentication
    // Clear OTP after successful verification
    user.otp = null;

    // Add new device fingerprint (stored in session during login)
    const fingerprint = req.session.pendingDevice;
    if (fingerprint && !user.knownDevices.includes(fingerprint)) {
      user.knownDevices.push(fingerprint);
    }

    req.session.pendingDevice = null; // Clear it after use
    await user.save();

    // Prepare session user data
    const userID = user._id.toString();
    const userData = {
      _id: userID,
      firstname: user.firstname,
      lastname: user.lastname,
      username: user.username,
      role: user.role,
      email: user.email,
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt || null,
    };

    // Regenerate session after OTP verification
    req.session.regenerate((err) => {
      if (err) {
        return res.status(500).json({ message: "Error regenerating session" });
      }

      req.session.user = userData;
      req.session.save((saveErr) => {
        if (saveErr) {
          return res.status(500).json({ message: "Error saving session" });
        }

        res.status(200).json({
          message: 'OTP verified successfully',
          data: userData,
        });
      });
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error verifying OTP', error });
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