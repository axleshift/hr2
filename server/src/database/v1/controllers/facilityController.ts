import logger from "../../../middlewares/logger";
import { Request as req, Response as res } from "express";
import Facility from "../models/facilities";

export const createFacility = async (req: req, res: res) => {
  try {
    const { name, description, location } = req.body;

    if (!name || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const facilityData = {
      name,
      description,
      location,
    };

    const newFacility = await Facility.create(facilityData);
    if (!newFacility) {
      return res.status(500).json({ message: "Facility not created" });
    }

    return res.status(201).json({ message: "Facility created", data: newFacility });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFacility = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const { name, description, location } = req.body;

    if (!name || !description || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    facility.name = name;
    facility.description = description;
    facility.location = location;

    const updatedFacility = await facility.save();
    if (!updatedFacility) {
      return res.status(500).json({ message: "Facility not updated" });
    }

    return res.status(200).json({ message: "Facility updated", data: updatedFacility });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFacilities = async (req: req, res: res) => {
  try {
    const facilities = await Facility.find();
    if (!facilities) {
      return res.status(404).json({ message: "Facilities not found" });
    }

    return res.status(200).json({ message: "Facilities found", data: facilities });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getFacilityById = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    return res.status(200).json({ message: "Facility found", data: facility });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFacility = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const facility = await Facility.findById(id);

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    await facility.deleteOne();

    return res.status(200).json({ message: "Facility removed" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
