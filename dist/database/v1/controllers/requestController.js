"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobpostingRequestById = exports.searchJobpostingRequests = exports.updateJobpostingRequest = exports.createJobpostingRequest = void 0;
const jobpostingRequest_1 = __importDefault(require("../models/jobpostingRequest"));
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const createJobpostingRequest = async (req, res) => {
    try {
        const { title, description, quantity, location, jobType, salaryRange, contact, email, phone } = req.body;
        if (!title || !quantity || !location || !jobType || !salaryRange) {
            return res.status(400).send("Please provide all required fields");
        }
        const data = new jobpostingRequest_1.default({
            title,
            description,
            quantity,
            location,
            jobType,
            salaryRange,
            contact,
            email,
            phone,
        });
        await data.save();
        res.status(201).send(data);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).send(error);
    }
};
exports.createJobpostingRequest = createJobpostingRequest;
const updateJobpostingRequest = async (req, res) => {
    try {
        const { title, description, quantity, location, jobType, salaryRange, contact, email, phone, status } = req.body;
        if (!title || !quantity || !location || !jobType || !salaryRange || !status) {
            return res.status(400).send("Please provide all required fields");
        }
        const data = await jobpostingRequest_1.default.findById(req.params.id);
        if (!data) {
            return res.status(404).send("Jobposting request not found");
        }
        data.title = title;
        data.description = description;
        data.quantity = quantity;
        data.location = location;
        data.jobType = jobType;
        data.salaryRange = salaryRange;
        data.contact = contact;
        data.email = email;
        data.phone = phone;
        data.status = status;
        await data.save();
        res.status(200).send(data);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).send(error);
    }
};
exports.updateJobpostingRequest = updateJobpostingRequest;
const searchJobpostingRequests = async (req, res) => {
    try {
        const { title, location, jobType, salaryRange, status } = req.query;
        const query = {};
        if (title)
            query.title = title;
        if (location)
            query.location = location;
        if (jobType)
            query.jobType = jobType;
        if (salaryRange)
            query.salaryRange = salaryRange;
        if (status)
            query.status = status;
        const data = await jobpostingRequest_1.default.find(query);
        res.status(200).send(data);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).send(error);
    }
};
exports.searchJobpostingRequests = searchJobpostingRequests;
const getJobpostingRequestById = async (req, res) => {
    try {
        const data = await jobpostingRequest_1.default.findById(req.params.id);
        if (!data) {
            return res.status(404).send("Jobposting request not found");
        }
        res.status(200).send(data);
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(400).send(error);
    }
};
exports.getJobpostingRequestById = getJobpostingRequestById;
