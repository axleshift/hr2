import logger from "../../../middlewares/logger";
import { Request as req, Response as res } from "express";
import Facility from "../models/facilityModel";
import FacilityEvent from "../models/facilityEventModel";
import Timeslot from "../models/timeslotModel";
import Applicant from "../models/applicantModel";
import mongoose from "mongoose";
import { sendEmail } from "../../../utils/mailHandler";
import path from "path";
import fs from "fs/promises"

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
    const { facilityId } = req.params;
    const { name, type, description, location } = req.body;

    if (!facilityId) {
      return res.status(400).json({ message: "Facility id is required" });
    }

    if (!name || !type || !description || !location) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const facility = await Facility.findById(facilityId);
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
      const timeslots = await Timeslot.find({ facility: facility._id });
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

// export const getFacilityById = async (req: req, res: res) => {
//   try {
//     const { facilityId } = req.params;
//     const facility = await Facility.findById(facilityId);

//     if (!facility) {
//       return res.status(404).json({ message: "Facility not found" });
//     }

//     const timeslots = await Timeslot.find({ facility: facilityId });

//     const timeslotsData = await Promise.all(timeslots.map(async (timeslot) => {
//       const participants = await Applicant.find({ events: timeslot.event });
//       return {
//         ...timeslot.toObject(),
//         participants,
//       };
//     }));

//     const facilityData = {
//       ...facility.toObject(),
//       timeslots: timeslotsData,
//     };

//     return res.status(200).json({ message: "Facility found", data: facilityData });
//   } catch (error) {
//     logger.error(error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getFacilityById = async (req: req, res: res) => {
  try {
    const { facilityId } = req.params;

    const facility = await Facility.findById(facilityId).populate({
      path: "timeslots",
      populate: {
        path: "event",
        model: "facilityEvents",
        // populate: {
        //   path: "participants.applicant",
        //   model: "Applicant",
        // },
      },
    });

    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    return res.status(200).json({ message: "Facility found", data: facility });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const removeFacility = async (req: req, res: res) => {
  try {
    const { facilityId } = req.params;
    const facility = await Facility.findById(facilityId);

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

const convertMinutesToTime = (minutes: number, format: "24h" | "12h" = "24h"): string => {
  let hours = Math.floor(minutes / 60);
  const mins = minutes % 60;

  if (format === "12h") {
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert 0 to 12 for AM
    return `${hours}:${mins < 10 ? "0" : ""}${mins} ${period}`;
  }

  return `${hours}:${mins < 10 ? "0" : ""}${mins}`;
};

export const createFacilityTimeslot = async (req: req, res: res) => {
  try {
    const { facilityId } = req.params;
    const { date, start, end } = req.body;

    if (!facilityId) {
      return res.status(400).json({ message: "Facility id is required" });
    }

    if (!date || !start || !end) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const startMinutes = convertTimeToMinutes(start);
    const endMinutes = convertTimeToMinutes(end);

    // Check if timeslot overlaps with existing timeslots
    const overlappingTimeslot = await Timeslot.findOne({
      facility: facilityId,
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
      facility: facilityId,
      start: startMinutes,
      end: endMinutes,
    };

    const newTimeslot = await Timeslot.create(timeslotData);
    if (!newTimeslot) {
      return res.status(500).json({ message: "Timeslot not created" });
    }
    if (!facility.timeslots) {
      facility.timeslots = [];
    }

    facility.timeslots.push(newTimeslot._id as mongoose.Types.ObjectId);
    await facility.save();

    return res.status(201).json({ message: "Timeslot created", data: newTimeslot });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllFacilityTimeslotsForDate = async (req: req, res: res) => {
  try {
    const { facilityId, date } = req.params;

    // Input Validation
    if (!facilityId) {
      return res.status(400).json({ message: 'Facility ID is required.' });
    }
    if (!date) {
      return res.status(400).json({ message: 'Date is required.' });
    }

    // Validate Facility Existence
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ message: 'Facility not found.' });
    }

    // Date Range Calculation
    const today = new Date(date);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Fetching Timeslots with Population
    const timeslots = await Timeslot.find({
      facility: facilityId,
      date: { $gte: today, $lt: tomorrow },
    }).populate({
      path: 'facility',
      model: 'Facility',
      select: 'name location',
    });

    if (!timeslots.length) {
      return res.status(404).json({ message: 'No timeslots found for the specified date.', date: today });
    }

    // Data Transformation
    const timeslotsData = timeslots.map((timeslot) => ({
      ...timeslot.toObject(),
      start: convertMinutesToTime(parseInt(timeslot.start)),
      end: convertMinutesToTime(parseInt(timeslot.end)),
    }));

    return res.status(200).json({ message: 'Timeslots retrieved successfully.', data: timeslotsData });
  } catch (error) {
    console.error('Error retrieving timeslots:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const removeFacilityTimeslot = async (req: req, res: res) => {
  try {
    const { timeslotId } = req.params;
    const timeslot = await Timeslot.findById(timeslotId);

    if (!timeslot) {
      return res.status(404).json({ message: "Timeslot not found" });
    }

    // delete the timeslot from the facility as well
    const facility = await Facility.findById(timeslot.facility);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    // check if the timeslot is associated with an event
    const event = await FacilityEvent.findOne({ timeslot: timeslotId });
    if (event) {
      return res.status(400).json({ message: "Timeslot is associated with an event. Cannot be deleted." });
    }

    facility.timeslots = facility.timeslots.filter((timeslotId) => !timeslotId.equals(timeslotId));
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
    const { name, description, capacity, type } = req.body;

    if (!timeslotId) {
      return res.status(400).json({ message: "Timeslot id is required" });
    }

    if (!name || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const timeslot = await Timeslot.findById(timeslotId);
    if (!timeslot) {
      return res.status(404).json({ message: "Timeslot not found" });
    }

    if (timeslot.event) {
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
      type,
      description,
      date: formattedDate,
      capacity,
      facility: timeslot.facility,
      timeslot: timeslotId,
    };

    const newEvent = await FacilityEvent.create(eventData);
    if (!newEvent) {
      return res.status(500).json({ message: "Event not created" });
    }
    timeslot.event = newEvent._id as mongoose.Types.ObjectId;
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

export const getFacilityEventByID = async (req: req, res: res) => {
  try {
    const { eventId } = req.params;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    const event = await FacilityEvent.findById(eventId).populate({
      path: 'participants.applicant',
      model: 'Applicant',
      select: 'firstname lastname email phone',
      transform: doc => doc ? doc.toObject() : doc
    });

    if (!event) {
      return res.status(404).json({ message: "No event found" });
    }

    return res.status(200).json({ message: "Event found", data: event });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const updateFacilityEvent = async (req: req, res: res) => {
  try {
    const { timeslotId } = req.params;
    const { name, description, capacity, type, isApproved } = req.body;
    
    if (!timeslotId) {
      return res.status(400).json({ message: "Timeslot id is required" });
    }

    if (!name || !capacity) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const timeslot = await Timeslot.findById(timeslotId);
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
    const authorId = req.session.user._id as string;
    const event = await FacilityEvent.findOne({ timeslot: timeslotId });
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    event.name = name;
    event.author = new mongoose.Types.ObjectId(authorId)
    event.description = description;
    event.type = type;
    event.date = formattedDate;
    event.capacity = capacity;
    event.isApproved = {
      status: isApproved,
      approvedBy: new mongoose.Types.ObjectId(req.session.user._id) as mongoose.Types.ObjectId
    }

    const updatedEvent = await event.save();
    if (!updatedEvent) {
      return res.status(500).json({ message: "Event not updated" });
    }

    return res.status(200).json({ message: "Event updated", data: updatedEvent });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const deleteFacilityEvent = async (req: req, res: res) => {
  try {
    const { timeslotId } = req.params;

    if (!timeslotId) {
      return res.status(400).json({ message: "Timeslot ID is required." });
    }

    // Find the timeslot by ID
    const timeslot = await Timeslot.findById(timeslotId);
    if (!timeslot) {
      return res.status(404).json({ message: "Timeslot not found." });
    }

    // Check if the timeslot has an associated event
    if (!timeslot.event) {
      return res.status(404).json({ message: "No event associated with this timeslot." });
    }

    // Delete the associated event
    const event = await FacilityEvent.findByIdAndDelete(timeslot.event);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Update the timeslot to remove the reference to the deleted event and mark it as available
    // timeslot.event = null;
    // timeslot.isAvailable = true;
    await Timeslot.updateOne({ _id: timeslotId }, { $unset: { event: "", isAvailable: true } });
    await timeslot.save();

    return res.status(200).json({ message: "Event deleted and timeslot updated successfully." });
  } catch (error) {
    logger.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getFacilityEventsForDate = async (req: req, res: res) => {
  try {
    const { eventId, date } = req.params;

    if (!eventId) {
      return res.status(400).json({ message: "Facility id is required" });
    }

    if (!date) {
      return res.status(400).json({ message: "Date is required" });
    }

    const facility = await Facility.findById(eventId);
    if (!facility) {
      return res.status(404).json({ message: "Facility not found" });
    }

    const today = new Date(date)
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const events = await FacilityEvent.find({ facility: eventId, date: { $gte: today, $lt: tomorrow } });

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
    const { eventId } = req.params;

    // Validate facility ID
    if (!eventId) {
      return res.status(400).json({ message: "Facility id is required" });
    }

    // Retrieve facility by ID
    const facility = await Facility.findById(eventId);
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

    const events = await FacilityEvent.find({ facility: eventId, date: { $gte: startDate, $lte: endDate } });
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
    const events = await FacilityEvent.find({ date: { $gte: today } });

    return res.status(200).json({ message: "Events found", data: events });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUpcomingEvents = async (req: req, res: res) => {
  try {
    const page = typeof req.query.page === "string" ? parseInt(req.query.page) : 1;
    const limit = typeof req.query.limit === "string" ? parseInt(req.query.limit) : 9;
    const skip = (page - 1) * limit;
    const today = new Date();

    // Initialize the query with the date condition
    const query: Record<string, unknown> = { date: { $gte: today } };

    // Add eventType to the query only if it's provided
    if (typeof req.query.eventType === "string") {
      query.type = req.query.eventType;
    }

    const events = await FacilityEvent.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        {
          path: 'author',
          model: 'User',
          select: '_id firstname lastname role'
        },
        {
          path: 'isApproved.approvedBy',
          model: 'User',
          select: '_id firstname lastname role'
        },
        {
          path: 'timeslot',
          model: 'Timeslot',
          select: '_id date start end event'
        },
        {
          path: 'facility',
          model: 'Facility',
          select: '_id name type location'
        }
      ])
      .lean()

    // Modify timeslot start and end times
    const modifiedEvents = events.map((event) => {
      if (event.timeslot && typeof event.timeslot === "object") {
        const timeslot = event.timeslot as unknown as { start: string; end: string }; // Type assertion
        return {
          ...event,
          timeslot: {
            ...timeslot,
            start: convertMinutesToTime(parseInt(timeslot.start)),
            end: convertMinutesToTime(parseInt(timeslot.end)),
          },
        };
      }
      return event;
    });

    if (!events.length) {
      return res.status(404).json({ message: "No upcoming events found" });
    }

    const totalItems = await FacilityEvent.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    return res.status(200).json({
      message: "Upcoming events retrieved successfully",
      data: modifiedEvents,
      totalItems,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const bookApplicantToEvent = async (req: req, res: res) => {
  try {
    const { eventId } = req.params;
    const { applicantId } = req.body;

    // Validate input
    if (!eventId) {
      return res.status(400).json({ message: 'Event ID is required.' });
    }
    if (!applicantId) {
      return res.status(400).json({ message: 'Applicant ID is required.' });
    }

    // Retrieve event and applicant concurrently
    const [event, applicant] = await Promise.all([
      FacilityEvent.findById(eventId),
      Applicant.findById(applicantId),
    ]);

    // Check if event exists
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if applicant exists
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found.' });
    }

    // Check if applicant is already booked for the event
    const isAlreadyBooked = event.participants.some(
      (p) => p.applicant.toString() === applicantId
    );
    if (isAlreadyBooked) {
      return res.status(400).json({ message: 'Applicant is already booked for this event.' });
    }

    // Check if event capacity has been reached
    if (event.participants.length >= event.capacity) {
      return res.status(400).json({ message: 'Event has reached its full capacity.' });
    }

    // Check if applicant is already booked for this event in their own events array
    const isApplicantAlreadyBooked = applicant.events.some(
      (event) => event.toString() === eventId
    );
    if (isApplicantAlreadyBooked) {
      return res.status(400).json({ message: 'Applicant is already booked for this event.' });
    }

    // Add event to applicant's events array
    applicant.events.push(new mongoose.Types.ObjectId(eventId));

    // Add applicant to event's participants array
    event.participants.push({
      applicant: new mongoose.Types.ObjectId(applicantId.toString()),
      mail: {
        sent: false,
        reason: '',
      },
    });

    // Save changes concurrently
    await Promise.all([event.save(), applicant.save()]);

    return res.status(200).json({ message: 'Applicant successfully booked for the event.' });
  } catch (error) {
    console.error('Error booking applicant to event:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const unbookApplicantFromEvent = async (req: req, res: res) => {
  try {
    const { eventId } = req.params;
    const { applicantId } = req.query;

    // Validate required parameters
    if (!eventId || !applicantId) {
      return res.status(400).json({ message: "Event ID and Applicant ID are required." });
    }

    // Validate MongoDB ObjectIds
    if (!mongoose.isValidObjectId(eventId) || !mongoose.isValidObjectId(applicantId)) {
      return res.status(400).json({ message: "Invalid Event ID or Applicant ID." });
    }

    // Convert to ObjectId
    const applicantObjectId = new mongoose.Types.ObjectId(applicantId.toString());

    // Find event and applicant
    const [event, applicant] = await Promise.all([
      FacilityEvent.findById(eventId),
      Applicant.findById(applicantObjectId),
    ]);

    if (!event) return res.status(404).json({ message: "Event not found." });
    if (!applicant) return res.status(404).json({ message: "Applicant not found." });

    // Check if the applicant is actually booked for the event
    const isBooked = event.participants.some((p) => p.applicant.toString() === applicantObjectId.toString());

    if (!isBooked) {
      return res.status(400).json({ message: "Applicant is not booked for this event." });
    }

    // Unbook applicant from event using `$pull`
    await FacilityEvent.updateOne(
      { _id: eventId },
      { $pull: { participants: { applicant: applicantObjectId } } }
    );

    // Remove event from applicant's events array
    await Applicant.updateOne(
      { _id: applicantObjectId },
      { $pull: { events: eventId } }
    );

    return res.status(200).json({ message: "Applicant successfully unbooked from event." });

  } catch (error) {
    console.error("Error unbooking applicant from event:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const SendEmailToFacilityEventParticipants = async (req: req, res: res) => {
  try {
    const { eventId } = req.params;

    if (!eventId || !mongoose.isValidObjectId(eventId)) {
      return res.status(400).json({ message: "Valid Event ID is required." });
    }

    // Fetch event and populate participants
    const event = await FacilityEvent.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    if (!event.participants || event.participants.length < 0) {
      return res.status(400).json({ message: "No participants for this event." });
    }

    const timeslot = await Timeslot.findById(event.timeslot);
    if (!timeslot) {
      return res.status(404).json({ message: "Timeslot not found." });
    }

    const templatePath = path.join(__dirname, '../../../public/templates/eventEmail.html');
    const emailTemplate = await fs.readFile(templatePath, "utf-8");

    const participantIds = event.participants.map((p) => p.applicant);

    const participants = await Applicant.find({ _id: { $in: participantIds } }).select("firstname lastname email");

    if (!participants || participants.length === 0) {
      return res.status(400).json({ message: "No valid participants with emails." });
    }

    const failedEmails: { applicant: string; reason: string }[] = [];
    let successfulEmails = 0;

    const participantUpdates = [];

    for (const participant of participants) {
      if (!participant.email) {
        failedEmails.push({ applicant: participant._id.toString(), reason: "No email provided" });
        participantUpdates.push({
          applicant: participant._id,
          mail: { sent: false, reason: "No email provided" }
        });
        continue;
      }

      const fullName = `${participant.firstname} ${participant.lastname}`;
      const facility = await Facility.findById(event.facility);
      if (!facility) {
        return res.status(404).json({ message: "Facility not found." });
      }

      const emailText = emailTemplate
        .replace(/{{fullName}}/g, fullName)
        .replace(/{{eventName}}/g, event.name || "Event")
        .replace(/{{eventDate}}/g, event.date ? event.date.toDateString() : "Unknown Date")
        .replace(/{{startTime}}/g, convertMinutesToTime(parseInt(timeslot.start), "12h"))
        .replace(/{{endTime}}/g, convertMinutesToTime(parseInt(timeslot.end), "12h"))
        .replace(/{{facilityName}}/g, facility.name || "Venue")
        .replace(/{{facilityLocation}}/g, facility.location || "Address")
        .replace(/{{eventType}}/g, event.type);

      const emailResult = await sendEmail(
        event.type,
        participant.email,
        `Reminder: ${event.name} on ${event.date.toDateString()}`,
        "",
        emailText
      );

      logger.info(JSON.stringify(emailResult, null, 2));

      if (!emailResult.success) {
        failedEmails.push({ applicant: participant._id.toString(), reason: emailResult.message });
        participantUpdates.push({
          applicant: participant._id,
          mail: { sent: false, reason: emailResult.message }
        });
        logger.error(`Failed to send email to ${participant.email}: ${emailResult.message}`);
      } else {
        successfulEmails++;
        participantUpdates.push({
          applicant: participant._id,
          mail: { sent: true, reason: "" }
        });
      }
    }

    // Update participants' mail status in bulk
    for (const update of participantUpdates) {
      await FacilityEvent.updateOne(
        { _id: eventId, "participants.applicant": update.applicant },
        {
          $set: {
            "participants.$.mail.sent": update.mail.sent,
            "participants.$.mail.reason": update.mail.reason
          }
        }
      );
    }

    // Update event's email status and log failed emails
    await FacilityEvent.findByIdAndUpdate(eventId, {
      $set: { "emailSent.status": successfulEmails > 0 }, // Set true if at least one email was sent
      $push: { "emailSent.history": { $each: failedEmails.map((f) => ({ date: new Date(), reason: f.reason })) } },
    });

    return res.status(200).json({
      message: "Emails processed successfully.",
      successfulEmails,
      failedEmails,
    });

  } catch (error) {
    logger.error("Error sending event emails:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};