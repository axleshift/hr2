import { hasher } from "../../../utils/hasher";
import { Request as req, Response as res } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { config } from "../../../config";
import dotenv from "dotenv";
import logger from "../../../middlewares/logger";
dotenv.config();

const salt = bcrypt.genSaltSync(10);

export const createUser = async (req: req, res: res) => {
    const { firstname, lastname, email, username, password, status, role } = req.body;
    if (!firstname || !lastname || !email || !username || !password || !status || !role) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Please provide all required fields",
        });
    }

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
            username: user.username,
            role: user.role,
            email: user.email,
            status: user.status,
            token: token,
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
