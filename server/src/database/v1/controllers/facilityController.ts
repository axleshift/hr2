import logger from "../../../middlewares/logger";
import { Request as req, Response as res } from "express";
import Facility from "../models/facilities";
import Events from "../models/facilityEvents";
import Time from "../models/time";

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

    // get all timeslots for each facility
    const facilitiesData = await Promise.all(facilities.map(async (facility) => {
      const timeslots = await Time.find({ facility: facility._id });
      return {
        ...facility.toObject(),
        timeslots,
      };
    }));

    return res.status(200).json({ message: "Facilities found", data: facilitiesData });

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

// Facility timeslots
const convertTimeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

const convertMinutesToTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}:${mins < 10 ? '0' : ''}${mins}`;
}

export const createFacilityTimeslot = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const { date, start, end } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Facility id is required" });
    }

    if (!date || !start || !end) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const startMinutes = convertTimeToMinutes(start);
    const endMinutes = convertTimeToMinutes(end);

    // Check if timeslot overlaps with existing timeslots
    const overlappingTimeslot = await Time.findOne({
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

    const newTimeslot = await Time.create(timeslotData);
    if (!newTimeslot) {
      return res.status(500).json({ message: "Timeslot not created" });
    }

    facility.timeslots.push(newTimeslot._id);
    await facility.save();

    return res.status(201).json({ message: "Timeslot created", data: newTimeslot });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFacilityTimeslotsForDate = async (req: req, res: res) => {
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

    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const today = new Date(date)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const timeslots = await Time.find({ facility: id, date: { $gte: today, $lt: tomorrow } });
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
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const removeFacilityTimeslot = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const timeslot = await Time.findById(id);

    if (!timeslot) {
      return res.status(404).json({ message: "Timeslot not found" });
    }

    // delete the timeslot from the facility as well
    const facility = await Facility.findById(timeslot.facility);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    // check if the timeslot is associated with an event
    const event = await Events.findOne({ timeslot: id });
    if (event) {
      return res.status(400).json({ message: "Timeslot is associated with an event. Cannot be deleted." });
    }

    facility.timeslots = facility.timeslots.filter((timeslotId) => !timeslotId.equals(id));
    await facility.save();
    await timeslot.deleteOne();

    return res.status(200).json({ message: "Timeslot removed" });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// Facility events

export const createFacilityEvent = async (req: req, res: res) => {
  try {
    const { timeslotId } = req.params;
    const { name, description, capacity } = req.body;

    if (!timeslotId) {
      return res.status(400).json({ message: "Timeslot id is required" });
    }

    if (!name || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const timeslot = await Time.findById(timeslotId);
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
    const authorId = req.session.user._id as string;
    const eventData = {
      name,
      author: authorId,
      description,
      date: formattedDate,
      capacity,
      facility: timeslot.facility,
      timeslot: timeslotId,
    };

    const newEvent = await Events.create(eventData);
    if (!newEvent) {
      return res.status(500).json({ message: "Event not created" });
    }
    timeslot.isAvailable = false;

    await timeslot.save();
    return res.status(201).json({
      message: "Event created",
      data: newEvent
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getFacilityEventById = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const event = await Events.findById(id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ message: "Event found", data: event });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getFacilityEventsForDate = async (req: req, res: res) => {
  try {
    const { id, date } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Facility id is required" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const today = new Date(date)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const events = await Events.find({ facility: id, date: { $gte: today, $lt: tomorrow } });

    if (!events) {
      return res.status(404).json({ message: "Events not found" });
    }

    return res.status(200).json({ message: "Events found", data: events });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// TODO: add pagination 
export const getFacilityCalendarStates = async (req: req, res: res) => {
  try {
    const { id } = req.params;

    // Validate facility ID
    if (!id) {
      return res.status(400).json({ message: "Facility id is required" });
    }

    // Retrieve facility by ID
    const facility = await Facility.findById(id);
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
    const startDate = new Date(parseInt(year as string), parseInt(month as string) - 1, 1);
    // set one month before the next month
    startDate.setMonth(startDate.getMonth() - 1);
    const endDate = new Date(parseInt(year as string), parseInt(month as string), 0);
    endDate.setMonth(endDate.getMonth() + 1);

    const events = await Events.find({ facility: id, date: { $gte: startDate, $lte: endDate } });
    const formattedEvents = events.map((event) => {
      return new Date(event.date).toISOString();
    });

    if (!events) {
      return res.status(404).json({ message: "Events not found" });
    }

    // Return the timeslots and events in the response
    return res.status(200).json({ message: "Calendar states found", data: formattedEvents, startDate, endDate });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getFacilityUpcomingEvents = async (req: req, res: res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "Facility id is required" });
    }

    const facility = await Facility.findById(id);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const today = new Date();
    const events = await Events.find({ date: { $gte: today } });

    return res.status(200).json({ message: "Events found", data: events });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUpcomingEvents = async (req: req, res: res) => {
  try {
    const today = new Date();
    const events = await Events.find({ date: { $gte: today } });
    if (!events || events.length === 0) {
      return res.status(404).json({ message: "Events not found" });
    }

    return res.status(200).json({ message: "Events found", data: events });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const BookApplicantToEvent = async (req: req, res: res) => {
  try {
    const { id } = req.params;
    const { applicantId } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Event id is required" });
    }

    if (!applicantId) {
      return res.status(400).json({ message: "Applicant id is required" });
    }

    const event = await Events.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.participants.includes(applicantId)) {
      return res.status(400).json({ message: "Applicant already booked for event" });
    }

    event.participants.push(applicantId);
    await event.save();

    return res.status(200).json({ message: "Applicant booked for event" });

  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}