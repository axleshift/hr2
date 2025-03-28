"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateByDate = exports.getDateById = exports.updateTimeslot = exports.updateDate = exports.createDate = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const facilityEventModel_1 = __importDefault(require("../models/facilityEventModel"));
const timeslotModel_1 = __importDefault(require("../models/timeslotModel"));
const convertToUTC = async (date) => {
    return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
};
const createDate = async (req, res) => {
    try {
        const { date, isAvailable, timeslots } = req.body;
        if (!date || !isAvailable || !timeslots) {
            return res.status(400).json({ message: "All fields are required" });
        }
        // convert date to utc
        const dateObj = new Date(date);
        const utcDate = await convertToUTC(dateObj);
        const dateData = {
            date: utcDate,
            isAvailable,
            timeslots,
        };
        const newDate = await facilityEventModel_1.default.create(dateData);
        if (!newDate) {
            return res.status(500).json({ message: "Date not created" });
        }
        return res.status(201).json({ message: "Date created", data: newDate });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createDate = createDate;
const updateDate = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, isAvailable } = req.body;
        if (!date || !isAvailable) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const dateData = await facilityEventModel_1.default.findById(id);
        if (!dateData) {
            return res.status(404).json({ message: "Date not found" });
        }
        const dateObj = new Date(date);
        const utcDate = await convertToUTC(dateObj);
        dateData.date = utcDate;
        dateData.isAvailable = isAvailable;
        const updatedDate = await dateData.save();
        if (!updatedDate) {
            return res.status(500).json({ message: "Date not updated" });
        }
        return res.status(200).json({ message: "Date updated", data: updatedDate });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateDate = updateDate;
const updateTimeslot = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, start, end, capacity, isAvailable } = req.body;
        if (!date || !start || !end || !capacity || !isAvailable) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const timeslot = await timeslotModel_1.default.findById(id);
        if (!timeslot) {
            return res.status(404).json({ message: "Timeslot not found" });
        }
        timeslot.date = date;
        timeslot.start = start;
        timeslot.end = end;
        timeslot.isAvailable = isAvailable;
        const updatedTimeslot = await timeslot.save();
        if (!updatedTimeslot) {
            return res.status(500).json({ message: "Timeslot not updated" });
        }
        return res.status(200).json({ message: "Timeslot updated", data: updatedTimeslot });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateTimeslot = updateTimeslot;
const getDateById = async (req, res) => {
    try {
        const { id } = req.params;
        const date = await facilityEventModel_1.default.findById(id);
        if (!date) {
            return res.status(404).json({ message: "Date not found" });
        }
        return res.status(200).json({ message: "Date found", data: date });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getDateById = getDateById;
const getDateByDate = async (req, res) => {
    try {
        const { date } = req.params;
        const dateObj = new Date(date);
        const utcDate = await convertToUTC(dateObj);
        const dateData = await facilityEventModel_1.default.findOne({ utcDate });
        if (!dateData) {
            return res.status(404).json({ message: "Date not found" });
        }
        return res.status(200).json({ message: "Date found", data: dateData });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getDateByDate = getDateByDate;
