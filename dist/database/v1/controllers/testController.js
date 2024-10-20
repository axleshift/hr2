"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.incrementTestRepetition = exports.getAllTests = exports.createTest = void 0;
const testModel_1 = __importDefault(require("../models/testModel"));
const createTest = async (req, res) => {
    const { title, content } = req.body;
    try {
        const test = await testModel_1.default.create({
            title,
            content,
            repetition: 1,
        });
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Test created successfully",
            test,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error creating test",
            error,
        });
    }
};
exports.createTest = createTest;
const getAllTests = async (req, res) => {
    try {
        const tests = await testModel_1.default.find();
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Tests retrieved successfully",
            tests: tests,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving tests",
            error,
        });
    }
};
exports.getAllTests = getAllTests;
const incrementTestRepetition = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTest = await testModel_1.default.findByIdAndUpdate(id, { $inc: { repetition: 1 } }, { new: true });
        if (updatedTest) {
            res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Repetition incremented successfully",
                test: updatedTest,
            });
        }
        else {
            res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Test not found",
            });
        }
    }
    catch (error) {
        console.error("Error incrementing repetition:", error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error incrementing repetition",
            error,
        });
    }
};
exports.incrementTestRepetition = incrementTestRepetition;
