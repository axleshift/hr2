"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFacilityTimeslot = exports.getAllFacilityTimeslotsForDate = exports.createFacilityTimeslot = exports.removeFacility = exports.getFacilityById = exports.getAllFacilities = exports.updateFacility = exports.createFacility = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const facilities_1 = __importDefault(require("../models/facilities"));
const facilityEvents_1 = __importDefault(require("../models/facilityEvents"));
const time_1 = __importDefault(require("../models/time"));
const createFacility = async (req, res) => {
    try {
        const { name, type, description, location } = req.body;
        if (!name || !type || !description || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const facilityData = {
            name,
            type,
            description,
            location,
        };
        const newFacility = await facilities_1.default.create(facilityData);
        if (!newFacility) {
            return res.status(500).json({ message: "Facility not created" });
        }
        return res.status(201).json({ message: "Facility created", data: newFacility });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createFacility = createFacility;
const updateFacility = async (req, res) => {
    try {
        console.log("req.params", req.params);
        console.log("req.body", req.body);
        const { id } = req.params;
        const { name, type, description, location } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Facility id is required" });
        }
        if (!name || !type || !description || !location) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const facility = await facilities_1.default.findById(id);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        facility.name = name;
        facility.type = type;
        facility.description = description;
        facility.location = location;
        const updatedFacility = await facility.save();
        if (!updatedFacility) {
            return res.status(500).json({ message: "Facility not updated" });
        }
        return res.status(200).json({ message: "Facility updated", data: updatedFacility });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateFacility = updateFacility;
const getAllFacilities = async (req, res) => {
    try {
        const facilities = await facilities_1.default.find();
        if (!facilities) {
            return res.status(404).json({ message: "Facilities not found" });
        }
        // get all timeslots for each facility
        const facilitiesData = await Promise.all(facilities.map(async (facility) => {
            const timeslots = await time_1.default.find({ facility: facility._id });
            return {
                ...facility.toObject(),
                timeslots,
            };
        }));
        return res.status(200).json({ message: "Facilities found", data: facilitiesData });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllFacilities = getAllFacilities;
const getFacilityById = async (req, res) => {
    try {
        const { id } = req.params;
        const facility = await facilities_1.default.findById(id);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        return res.status(200).json({ message: "Facility found", data: facility });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFacilityById = getFacilityById;
const removeFacility = async (req, res) => {
    try {
        const { id } = req.params;
        const facility = await facilities_1.default.findById(id);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        await facility.deleteOne();
        return res.status(200).json({ message: "Facility removed" });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.removeFacility = removeFacility;
// Facility timeslots
const convertTimeToMinutes = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
};
const convertMinutesToTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}:${mins < 10 ? '0' : ''}${mins}`;
};
const createFacilityTimeslot = async (req, res) => {
    try {
        const { id } = req.params;
        const { date, start, end } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Facility id is required" });
        }
        if (!date || !start || !end) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const facility = await facilities_1.default.findById(id);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        const startMinutes = convertTimeToMinutes(start);
        const endMinutes = convertTimeToMinutes(end);
        // Check if timeslot overlaps with existing timeslots
        const overlappingTimeslot = await time_1.default.findOne({
            facility: id,
            date,
            $or: [
                { start: { $lt: endMinutes, $gte: startMinutes } },
                { end: { $gt: startMinutes, $lte: endMinutes } },
                { start: { $lte: startMinutes }, end: { $gte: endMinutes } }
            ]
        });
        if (overlappingTimeslot) {
            return res.status(400).json({ message: "Timeslot overlaps with an existing timeslot" });
        }
        const timeslotData = {
            date,
            facility: id,
            start: startMinutes,
            end: endMinutes,
        };
        const newTimeslot = await time_1.default.create(timeslotData);
        if (!newTimeslot) {
            return res.status(500).json({ message: "Timeslot not created" });
        }
        facility.timeslots.push(newTimeslot._id);
        await facility.save();
        return res.status(201).json({ message: "Timeslot created", data: newTimeslot });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createFacilityTimeslot = createFacilityTimeslot;
const getAllFacilityTimeslotsForDate = async (req, res) => {
    try {
        const { id, date } = req.params;
        console.log("id", id);
        console.log("date", new Date(date).toISOString());
        if (!id) {
            return res.status(400).json({ message: "Facility id is required" });
        }
        if (!date) {
            return res.status(400).json({ message: "Date is required" });
        }
        const facility = await facilities_1.default.findById(id);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        const today = new Date(date);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const timeslots = await time_1.default.find({ facility: id, date: today });
        if (!timeslots) {
            return res.status(404).json({ message: "Timeslots not found" });
        }
        const timeslotsData = timeslots.map((timeslot) => {
            return {
                ...timeslot.toObject(),
                start: convertMinutesToTime(parseInt(timeslot.start)),
                end: convertMinutesToTime(parseInt(timeslot.end)),
            };
        });
        return res.status(200).json({ message: "Timeslots found", data: timeslotsData });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getAllFacilityTimeslotsForDate = getAllFacilityTimeslotsForDate;
const removeFacilityTimeslot = async (req, res) => {
    try {
        const { id } = req.params;
        const timeslot = await time_1.default.findById(id);
        if (!timeslot) {
            return res.status(404).json({ message: "Timeslot not found" });
        }
        // delete the timeslot from the facility as well
        const facility = await facilities_1.default.findById(timeslot.facility);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        // check if the timeslot is associated with an event
        const event = await facilityEvents_1.default.findOne({ timeslot: id });
        if (event) {
            return res.status(400).json({ message: "Timeslot is associated with an event. Cannot be deleted." });
        }
        facility.timeslots = facility.timeslots.filter((timeslotId) => !timeslotId.equals(id));
        await facility.save();
        await timeslot.deleteOne();
        return res.status(200).json({ message: "Timeslot removed" });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.removeFacilityTimeslot = removeFacilityTimeslot;
