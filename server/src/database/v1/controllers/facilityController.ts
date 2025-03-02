import logger from "../../../middlewares/logger";
import { Request as req, Response as res } from "express";
import Facility from "../models/facilities";
import Events from "../models/facilityEvents";

export const createFacility = async (req: req, res: res) => {
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
    const { name, type, description, location } = req.body;

    if (!name || !type || !description || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const facility = await Facility.findById(id);
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

// Facility events

export const createFacilityEvent = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const { name, description, date } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Facility id is required" });
    }

    if (!name || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const eventData = {
      name,
      description,
      date,
    };

    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }
    const newEventData = await Events.create(eventData);
    if (!newEventData) {
      return res.status(500).json({ message: "Facility date not created" });
    }

    facility.dates.push(newEventData._id);
    await facility.save();

    return res.status(201).json({ message: "Facility date created", data: newEventData });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const updateFacilityEvent = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const { name, description, date, timeslots } = req.body;

    if (!name || !date || !timeslots) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const events = await Events.findById(id);
    if (!events) {
      return res.status(404).json({ message: "Facility date not found" });
    }

    events.name = name;
    events.description = description;
    events.date = date;
    events.timeslots = timeslots;

    const updatedFacilityDate = await events.save();
    if (!updatedFacilityDate) {
      return res.status(500).json({ message: "Facility date not updated" });
    }

    return res.status(200).json({ message: "Facility date updated", data: updatedFacilityDate });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getFacilityEventsByIdAndDate = async (req: req, res: res) => {
  try {
    const { id, date } = req.params;
    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const defDate = new Date(date);
    const tomorrow = new Date(defDate);
    // const log = {
    //   "defDate": defDate,
    //   "tomorrow": tomorrow
    // }
    // console.log(JSON.stringify(log, null, 2));
    tomorrow.setDate(defDate.getDate() + 1);
    const dataForDate = await Events.find({
      date: {
        $gte: defDate,
        $lt: tomorrow,
      },
    });

    return res.status(200).json({
      message: "Data for date found", data: dataForDate
    });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
