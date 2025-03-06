"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSlotById = exports.createSlotForADate = exports.getAllSlotsForADate = exports.getSlotById = void 0;
const UTCDate_1 = __importDefault(require("../../../utils/UTCDate"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const timeslot_1 = __importDefault(require("../models/timeslot"));
const getSlotById = async (req, res) => {
    const { id } = req.params;
    try {
        const slot = await timeslot_1.default.findById(id);
        if (!slot || slot === null) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Slot not found",
            });
        }
        logger_1.default.info(slot);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Slot retrieved successfully",
            data: slot,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving slot",
            error,
        });
    }
};
exports.getSlotById = getSlotById;
const getAllSlotsForADate = async (req, res) => {
    try {
        const date = typeof req.query.date === "string" ? req.query.date : new Date().toISOString();
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;
        const total = await timeslot_1.default.countDocuments();
        logger_1.default.info("Getting all slots for a date");
        logger_1.default.info(date);
        // Validate date input
        if (!date || isNaN(new Date(date).valueOf())) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Invalid date format",
            });
        }
        const startDate = new Date(date).setHours(0, 0, 0, 0);
        const endDate = new Date(startDate).setDate(new Date(startDate).getDate() + 1);
        const slots = await timeslot_1.default
            .find({
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        })
            .skip(skip)
            .limit(limit)
            .sort({ start: 1 });
        if (!slots || slots === null) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No slots found",
            });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            date: startDate,
            message: "Slots retrieved successfully",
            data: slots,
            total: total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving slots",
            error: error,
        });
    }
};
exports.getAllSlotsForADate = getAllSlotsForADate;
const createSlotForADate = async (req, res) => {
    try {
        logger_1.default.info("Creating a time slot for a date");
        logger_1.default.info(req.body);
        const { date, timeslot } = req.body;
        // Ensure the date is valid, clean it up and set the time to 00:00:00
        const parsedDate = new Date(date).setUTCHours(0, 0, 0, 0);
        const startDate = (0, UTCDate_1.default)(parsedDate);
        console.log("createSlotForADate -> startDate", startDate);
        const inputSlot = timeslot;
        console.log("createSlotForADate -> inputSlot", inputSlot);
        // Check if the timeslot already exists        
        const existingSlot = await timeslot_1.default.findOne({
            date: startDate,
            start: timeslot.start,
            end: timeslot.end,
        });
        if (existingSlot) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: "Timeslot already exists for the specified date",
            });
        }
        const newSlot = new timeslot_1.default({
            date: startDate,
            start: timeslot.start,
            end: timeslot.end,
            isAvailable: true,
        });
        await newSlot.save();
        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Time slot created successfully",
            data: newSlot,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred while creating the time slots",
            error: error,
        });
    }
};
exports.createSlotForADate = createSlotForADate;
const deleteSlotById = async (req, res) => {
    const { id } = req.params;
    console.log("deleteSlotById -> id", id);
    try {
        const slot = await timeslot_1.default.findByIdAndDelete(id);
        if (!slot || slot === null) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Slot not found",
            });
        }
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Slot deleted successfully",
            data: slot,
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error deleting slot",
            error,
        });
    }
};
exports.deleteSlotById = deleteSlotById;
