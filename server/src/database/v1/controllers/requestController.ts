import mongoose from "mongoose";
import JobpostingRequest from "../models/jobpostingRequest";
import logger from "../../../middlewares/logger";
import { Request as req, Response as res } from "express";

export const createJobpostingRequest = async (req: req, res: res) => {
    try {
        const { title, description, quantity, location, jobType, salaryRange, contact, email, phone } = req.body;
        if (!title || !quantity || !location || !jobType || !salaryRange) {
            return res.status(400).send("Please provide all required fields");
        }

        const data = new JobpostingRequest({
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
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
};

export const updateJobpostingRequest = async (req: req, res: res) => {
    try {
        const { title, description, quantity, location, jobType, salaryRange, contact, email, phone, status } = req.body;
        if (!title || !quantity || !location || !jobType || !salaryRange || !status) {
            return res.status(400).send("Please provide all required fields");
        }

        const data = await JobpostingRequest.findById(req.params.id);
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
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
}

export const searchJobpostingRequests = async (req: req, res: res) => {
    try {
        const { title, location, jobType, salaryRange, status } = req.query;
        const query: any = {};
        if (title) query.title = title;
        if (location) query.location = location;
        if (jobType) query.jobType = jobType;
        if (salaryRange) query.salaryRange = salaryRange;
        if (status) query.status = status;
        const data = await JobpostingRequest.find(query);
        res.status(200).send(data);
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
};

export const getJobpostingRequestById = async (req: req, res: res) => {
    try {
        const data = await JobpostingRequest.findById(req.params.id);
        if (!data) {
            return res.status(404).send("Jobposting request not found");
        }
        res.status(200).send(data);
    } catch (error) {
        logger.error(error);
        res.status(400).send(error);
    }
}