import logger from "../../../middlewares/logger";
import { Request as req, Response as res } from "express";
import FacilityEvent from "../models/facilityEventModel";
import Time from "../models/timeslotModel";

const convertToUTC = async (date: Date) => {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
};

export const createDate = async (req: req, res: res) => {
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

    const newDate = await FacilityEvent.create(dateData);
    if (!newDate) {
      return res.status(500).json({ message: "Date not created" });
    }

    return res.status(201).json({ message: "Date created", data: newDate });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDate = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const { date, isAvailable } = req.body;

    if (!date || !isAvailable) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const dateData = await FacilityEvent.findById(id);
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
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateTimeslot = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const { date, start, end, capacity, isAvailable } = req.body;

    if (!date || !start || !end || !capacity || !isAvailable) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const timeslot = await Time.findById(id);
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
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDateById = async (req: req, res: res) => {
  try {
    const { id } = req.params;

    const date = await FacilityEvent.findById(id);
    if (!date) {
      return res.status(404).json({ message: "Date not found" });
    }

    return res.status(200).json({ message: "Date found", data: date });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDateByDate = async (req: req, res: res) => {
  try {
    const { date } = req.params;

    const dateObj = new Date(date);
    const utcDate = await convertToUTC(dateObj);

    const dateData = await FacilityEvent.findOne({ utcDate });
    if (!dateData) {
      return res.status(404).json({ message: "Date not found" });
    }

    return res.status(200).json({ message: "Date found", data: dateData });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
