"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookApplicantToEvent = exports.getUpcomingEvents = exports.getFacilityUpcomingEvents = exports.getFacilityCalendarStates = exports.getFacilityEventsForDate = exports.updateFacilityEvent = exports.getFacilityEventByID = exports.createFacilityEvent = exports.removeFacilityTimeslot = exports.getAllFacilityTimeslotsForDate = exports.createFacilityTimeslot = exports.removeFacility = exports.getFacilityById = exports.getAllFacilities = exports.updateFacility = exports.createFacility = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const facilities_1 = __importDefault(require("../models/facilities"));
const facilityEvents_1 = __importDefault(require("../models/facilityEvents"));
const time_1 = __importDefault(require("../models/time"));
const applicant_1 = __importDefault(require("../models/applicant"));
const mongoose_1 = __importDefault(require("mongoose"));
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
        const timeslots = await time_1.default.find({ facility: id });
        const timeslotsData = await Promise.all(timeslots.map(async (timeslot) => {
            const participants = await applicant_1.default.find({ events: timeslot.event });
            return {
                ...timeslot.toObject(),
                participants,
            };
        }));
        const facilityData = {
            ...facility.toObject(),
            timeslots: timeslotsData,
        };
        return res.status(200).json({ message: "Facility found", data: facilityData });
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
        const timeslots = await time_1.default.find({ facility: id, date: { $gte: today, $lt: tomorrow } });
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
// Facility events
const createFacilityEvent = async (req, res) => {
    try {
        const { timeslotId } = req.params;
        const { name, description, capacity } = req.body;
        if (!timeslotId) {
            return res.status(400).json({ message: "Timeslot id is required" });
        }
        if (!name || !capacity) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const timeslot = await time_1.default.findById(timeslotId);
        if (!timeslot) {
            return res.status(404).json({ message: "Timeslot not found" });
        }
        if (!timeslot.isAvailable) {
            return res.status(400).json({ message: "Timeslot is not available" });
        }
        const date = timeslot.date;
        const formattedDate = new Date(date);
        if (formattedDate.toDateString() !== new Date(timeslot.date).toDateString()) {
            return res.status(400).json({ message: "Event date does not match timeslot date" });
        }
        if (!req.session.user) {
            return res.status(400).json({ message: "User session not found" });
        }
        const authorId = req.session.user._id;
        const eventData = {
            name,
            author: authorId,
            description,
            date: formattedDate,
            capacity,
            facility: timeslot.facility,
            timeslot: timeslotId,
        };
        const newEvent = await facilityEvents_1.default.create(eventData);
        if (!newEvent) {
            return res.status(500).json({ message: "Event not created" });
        }
        timeslot.event = new mongoose_1.default.Types.ObjectId(newEvent._id);
        timeslot.isAvailable = false;
        await timeslot.save();
        return res.status(201).json({
            message: "Event created",
            data: newEvent
        });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createFacilityEvent = createFacilityEvent;
const getFacilityEventByID = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Event id is required" });
        }
        const event = await facilityEvents_1.default.findById(id);
        if (!event) {
            return res.status(404).json({ message: "No Event found" });
        }
        const participants = await Promise.all(event.participants.map(async (participantId) => {
            const participant = await applicant_1.default.findById(participantId);
            if (participant) {
                return {
                    _id: participant._id,
                    firstname: participant.firstname,
                    lastname: participant.lastname,
                    email: participant.email,
                };
            }
            return null;
        }));
        const formattedEvent = {
            ...event.toObject(),
            participants: participants.filter(participant => participant !== null)
        };
        return res.status(200).json({ message: "Event found", data: formattedEvent });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFacilityEventByID = getFacilityEventByID;
const updateFacilityEvent = async (req, res) => {
    try {
        const { timeslotId } = req.params;
        const { name, description, capacity } = req.body;
        if (!timeslotId) {
            return res.status(400).json({ message: "Timeslot id is required" });
        }
        if (!name || !capacity) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const timeslot = await time_1.default.findById(timeslotId);
        if (!timeslot) {
            return res.status(404).json({ message: "Timeslot not found" });
        }
        const date = timeslot.date;
        const formattedDate = new Date(date);
        if (formattedDate.toDateString() !== new Date(timeslot.date).toDateString()) {
            return res.status(400).json({ message: "Event date does not match timeslot date" });
        }
        if (!req.session.user) {
            return res.status(400).json({ message: "User session not found" });
        }
        const authorId = req.session.user._id;
        const event = await facilityEvents_1.default.findOne({ timeslot: timeslotId });
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        event.name = name;
        event.author = new mongoose_1.default.Types.ObjectId(authorId);
        event.description = description;
        event.date = formattedDate;
        event.capacity = capacity;
        // event.facility = new mongoose.Types.ObjectId(event.facility)
        // event.timeslot = new mongoose.Types.ObjectId(event.timeslot);
        const updatedEvent = await event.save();
        if (!updatedEvent) {
            return res.status(500).json({ message: "Event not updated" });
        }
        return res.status(200).json({ message: "Event updated", data: updatedEvent });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateFacilityEvent = updateFacilityEvent;
const getFacilityEventsForDate = async (req, res) => {
    try {
        const { id, date } = req.params;
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
        const events = await facilityEvents_1.default.find({ facility: id, date: { $gte: today, $lt: tomorrow } });
        if (!events) {
            return res.status(404).json({ message: "Events not found" });
        }
        return res.status(200).json({ message: "Events found", data: events });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFacilityEventsForDate = getFacilityEventsForDate;
// TODO: add pagination 
const getFacilityCalendarStates = async (req, res) => {
    try {
        const { id } = req.params;
        // Validate facility ID
        if (!id) {
            return res.status(400).json({ message: "Facility id is required" });
        }
        // Retrieve facility by ID
        const facility = await facilities_1.default.findById(id);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        const { month, year } = req.query;
        // Validate month and year
        if (!month || !year) {
            return res.status(400).json({ message: "Month and year are required" });
        }
        // Create start and end dates for the specified month and year
        // Note: month is expected to be 1-based (1 for January, 2 for February, etc.)
        // Date object expects month to be 0-based (0 for January, 1 for February, etc.)
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        // set one month before the next month
        startDate.setMonth(startDate.getMonth() - 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0);
        endDate.setMonth(endDate.getMonth() + 1);
        const events = await facilityEvents_1.default.find({ facility: id, date: { $gte: startDate, $lte: endDate } });
        const formattedEvents = events.map((event) => {
            return new Date(event.date).toISOString();
        });
        if (!events) {
            return res.status(404).json({ message: "Events not found" });
        }
        // Return the timeslots and events in the response
        return res.status(200).json({ message: "Calendar states found", data: formattedEvents, startDate, endDate });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFacilityCalendarStates = getFacilityCalendarStates;
const getFacilityUpcomingEvents = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Facility id is required" });
        }
        const facility = await facilities_1.default.findById(id);
        if (!facility) {
            return res.status(404).json({ message: "Facility not found" });
        }
        const today = new Date();
        const events = await facilityEvents_1.default.find({ date: { $gte: today } });
        return res.status(200).json({ message: "Events found", data: events });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getFacilityUpcomingEvents = getFacilityUpcomingEvents;
const getUpcomingEvents = async (req, res) => {
    try {
        const today = new Date();
        const events = await facilityEvents_1.default.find({ date: { $gte: today } });
        if (!events || events.length === 0) {
            return res.status(404).json({ message: "Events not found" });
        }
        return res.status(200).json({ message: "Events found", data: events });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getUpcomingEvents = getUpcomingEvents;
const BookApplicantToEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const { applicantId } = req.body;
        if (!id) {
            return res.status(400).json({ message: "Event id is required" });
        }
        if (!applicantId) {
            return res.status(400).json({ message: "Applicant id is required" });
        }
        const event = await facilityEvents_1.default.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }
        const applicant = await applicant_1.default.findById(applicantId);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        if (event.participants.includes(applicantId)) {
            return res.status(400).json({ message: "Applicant already booked for event" });
        }
        if (event.participants.length >= event.capacity) {
            return res.status(400).json({ message: "Event is full" });
        }
        if (applicant.events.includes(applicantId)) {
            return res.status(400).json({ message: "Applicant already booked for event" });
        }
        applicant.events.push(new mongoose_1.default.Types.ObjectId(id));
        event.participants.push(applicantId);
        await event.save();
        await applicant.save();
        return res.status(200).json({ message: "Applicant booked for event" });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.BookApplicantToEvent = BookApplicantToEvent;
