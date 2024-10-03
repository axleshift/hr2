import { hasher } from "../../utils/hasher";
import { Request as req, Response as res } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";

import dotenv from "dotenv";
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
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error creating user",
            error,
        });
    }
};

export const verifyUser = async (req: req, res: res) => {
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
        const isPasswordValid = await bcrypt.compare(password, storedHashedPassword);

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
        };

        console.log(data);
        req.session.user = data;
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
