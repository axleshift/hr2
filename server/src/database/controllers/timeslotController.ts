import logger from "../../middlewares/logger";
import interviewTimeSlotModel from "../models/interviewTimeSlotModel";
import { Request as req, Response as res } from "express";

export const getSlotById = async (req: req, res: res) => {
    const { id } = req.params;
    try {
        const slot = await interviewTimeSlotModel.findById(id);

        if (!slot || slot === null) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Slot not found",
            });
        }

        logger.info(slot);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Slot retrieved successfully",
            data: slot,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving slot",
            error,
        });
    }
};

export const getAllSlotsForADate = async (req: req, res: res) => {
    try {
        const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
        const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
        const skip = (page - 1) * limit;
        const total = await interviewTimeSlotModel.countDocuments();

        const { date } = req.params;
        logger.info("Getting all slots for a date");
        logger.info(date);
        // Validate date input
        if (!date || isNaN(new Date(date).valueOf())) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Invalid date format",
            });
        }

        const startDate = new Date(date).setUTCHours(0, 0, 0, 0);
        const endDate = new Date(startDate).setDate(new Date(startDate).getDate() + 1);

        const slots = await interviewTimeSlotModel
            .find({
                date: {
                    $gte: startDate,
                    $lt: endDate,
                },
            })
            .skip(skip)
            .limit(limit)
            .sort({ start: 1 });

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
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error retrieving slots",
            error: error,
        });
    }
};

export const createSlotForADate = async (req: req, res: res) => {
    try {
        logger.info("Creating a time slot for a date");
        logger.info(req.body);
        const { date, timeslot } = req.body;

        // Ensure the date is valid, clean it up and set the time to 00:00:00
        const startDate = new Date(date).setHours(0, 0, 0, 0);

        // Check if the timeslot already exists
        const existingSlot = await interviewTimeSlotModel.findOne({
            data: {
                $gte: startDate,
                $lt: new Date(startDate).setDate(new Date(startDate).getDate() + 1),
            },
        });

        if (existingSlot) {
            return res.status(409).json({
                statusCode: 409,
                success: false,
                message: "Timeslot already exists for the specified date",
            });
        }

        const newSlot = new interviewTimeSlotModel({
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
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "An error occurred while creating the time slots",
            error: error,
        });
    }
};

export const deleteSlotById = async (req: req, res: res) => {
    const { id } = req.params;
    try {
        const slot = await interviewTimeSlotModel.findByIdAndDelete(id);

        if (!slot || slot === null) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Slot not found",
            });
        }

        logger.info(slot);
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Slot deleted successfully",
            data: slot,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error deleting slot",
            error,
        });
    }
};
