/**
 * @file applicantController.ts
 * @description Controller for handling applicant data
 */

import { Request as req, Response as res } from "express";
import logger from "../../../middlewares/logger";
import Applicant from "../models/applicantModel";
import jobpostingModel from "../models/jobpostingModel";
import FacilityEvent from "../models/facilityEventModel";

export const statistics = async (req: req, res: res) => {
  try {
    const now = new Date();
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);


    // Applicants
    const totalApplicants = await Applicant.countDocuments();
    const recentApplicants = await Applicant.find({
      createdAt: { $gte: lastWeek }
    })
      .sort({ createdAt: -1 })
      .limit(10) // optional: limit to top 10 most recent
      .select('firstname lastname email phone jobAppliedFor yearsOfExperience highestQualification statuses createdAt');

    const applicantsPerDay = await Applicant.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const applicantsThisMonth = await Applicant.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    const journeyProgression = await Applicant.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(now.getFullYear(), now.getMonth(), 1),
            $lte: new Date(now.getFullYear(), now.getMonth() + 1, 0),
          },
        },
      },
      {
        $project: {
          createdAt: 1,
          'statuses.journey': 1,
          date: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
        },
      },
      {
        $group: {
          _id: '$date',
          isShortlisted: {
            $sum: {
              $cond: ['$statuses.journey.isShortlisted', 1, 0],
            },
          },
          isInitialInterview: {
            $sum: {
              $cond: ['$statuses.journey.isInitialInterview', 1, 0],
            },
          },
          isTechnicalInterview: {
            $sum: {
              $cond: ['$statuses.journey.isTechnicalInterview', 1, 0],
            },
          },
          isPanelInterview: {
            $sum: {
              $cond: ['$statuses.journey.isPanelInterview', 1, 0],
            },
          },
          isBehavioralInterview: {
            $sum: {
              $cond: ['$statuses.journey.isBehavioralInterview', 1, 0],
            },
          },
          isFinalInterview: {
            $sum: {
              $cond: ['$statuses.journey.isFinalInterview', 1, 0],
            },
          },
          isJobOffer: {
            $sum: {
              $cond: ['$statuses.journey.isJobOffer', 1, 0],
            },
          },
          isHired: {
            $sum: {
              $cond: ['$statuses.journey.isHired', 1, 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ])


    const currentStages = await Applicant.aggregate([
      {
        $project: {
          currentStage: {
            $switch: {
              branches: [
                { case: { $eq: ["$statuses.journey.isHired", true] }, then: "Hired" },
                { case: { $eq: ["$statuses.journey.isJobOffer", true] }, then: "Job Offer" },
                { case: { $eq: ["$statuses.journey.isFinalInterview", true] }, then: "Final Interview" },
                { case: { $eq: ["$statuses.journey.isBehavioralInterview", true] }, then: "Behavioral Interview" },
                { case: { $eq: ["$statuses.journey.isPanelInterview", true] }, then: "Panel Interview" },
                { case: { $eq: ["$statuses.journey.isTechnicalInterview", true] }, then: "Technical Interview" },
                { case: { $eq: ["$statuses.journey.isInitialInterview", true] }, then: "Initial Interview" },
                { case: { $eq: ["$statuses.journey.isShortlisted", true] }, then: "Shortlisted" },
              ],
              default: "Applied",
            },
          }
        }
      },
      {
        $group: {
          _id: "$currentStage",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ])


    const experienceHistogram = await Applicant.aggregate([
      {
        $bucket: {
          groupBy: "$yearsOfExperience",
          boundaries: [0, 1, 3, 5, 10, 15, 20, 30],
          default: "30+",
          output: { count: { $sum: 1 } }
        }
      }
    ]);

    const jobHistogram = await Applicant.aggregate([
      {
        $group: {
          _id: "$jobAppliedFor",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 } // top 10
    ]);

    const qualificationHistogram = await Applicant.aggregate([
      {
        $group: {
          _id: "$highestQualification",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const graduationHistogram = await Applicant.aggregate([
      {
        $match: { graduationYear: { $ne: null } }
      },
      {
        $group: {
          _id: "$graduationYear",
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const monthlyHistogram = await Applicant.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // Additional statistics
    const avgExperience = await Applicant.aggregate([
      { $group: { _id: null, avgExperience: { $avg: "$yearsOfExperience" } } }
    ]);

    const genderStats = await Applicant.aggregate([
      { $group: { _id: "$gender", count: { $sum: 1 } } }
    ]);

    const avgSalary = await Applicant.aggregate([
      { $group: { _id: null, avgSalary: { $avg: "$salaryExpectation" } } }
    ]);

    const locationStats = await Applicant.aggregate([
      { $group: { _id: "$preferredWorkLocation", count: { $sum: 1 } } }
    ]);

    const sourceStats = await Applicant.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } }
    ]);

    const timeToHire = await Applicant.aggregate([
      { $match: { "statuses.journey.isHired": true } },
      { $project: { timeToHire: { $subtract: ["$hiredAt", "$createdAt"] } } },
      { $group: { _id: null, avgTimeToHire: { $avg: "$timeToHire" } } }
    ]);

    // jobpostings
    const totalJobPostings = await jobpostingModel.countDocuments();

    // Active job postings (not expired)
    const activeJobPostings = await jobpostingModel.countDocuments({
      isExpired: false,
      status: { $ne: "expired" },
    });

    // Expired job postings
    const expiredJobPostings = await jobpostingModel.countDocuments({
      isExpired: true,
    });

    const recentJobs = await jobpostingModel.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title type location salary_min salary_max schedule_start schedule_end status createdAt');

    // Job postings grouped by type (e.g., full-time, part-time)
    const jobTypes = await jobpostingModel.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
    ]);

    // Average salary ranges (min and max)

    // Events
    const totalEvents = await FacilityEvent.countDocuments();

    const recentEvents = await FacilityEvent.find({
      createdAt: { $gte: lastWeek }
    })
      .sort({ createdAt: -1 })
      .limit(10) // Optional: limit to top 10 most recent events
      .select('name type date facility capacity isAvailable isApproved createdAt')
      .populate({
        path: "facility",
        model: "Facility"
      })

    const eventsPerDay = await FacilityEvent.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startOfMonth,
            $lte: endOfMonth
          }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const eventsThisMonth = await FacilityEvent.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth
      }
    });

    const eventTypes = await FacilityEvent.aggregate([
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const eventApprovalStatus = await FacilityEvent.aggregate([
      {
        $group: {
          _id: "$isApproved.status",
          count: { $sum: 1 }
        }
      }
    ]);

    const eventParticipants = await FacilityEvent.aggregate([
      { $unwind: "$participants" },
      {
        $group: {
          _id: "$participants.applicant",
          count: { $sum: 1 }
        }
      }
    ]);

    // Event capacity utilization (how many slots are filled)
    const eventCapacityUtilization = await FacilityEvent.aggregate([
      {
        $project: {
          name: 1,
          capacity: 1,
          participantsCount: { $size: "$participants" },
          utilization: {
            $divide: [{ $size: "$participants" }, "$capacity"]
          }
        }
      }
    ]);

    res.json({
      applicants: {
        totalApplicants,
        recentApplicants,
        applicantsPerDay,
        applicantsThisMonth,
        journeyProgression,
        currentStages,
        histograms: {
          yearsOfExperience: experienceHistogram,
          jobAppliedFor: jobHistogram,
          qualifications: qualificationHistogram,
          graduationYear: graduationHistogram,
          monthlyHistogram,
        },
        additionalStats: {
          avgExperience: avgExperience[0]?.avgExperience || 0,
          genderStats,
          avgSalary: avgSalary[0]?.avgSalary || 0,
          locationStats,
          sourceStats,
          timeToHire: timeToHire[0]?.avgTimeToHire || 0,
        }
      },
      jobpostings: {
        totalJobPostings,
        recentJobs,
        activeJobPostings,
        expiredJobPostings,
        jobTypes,
      },
      events: {
        totalEvents,
        recentEvents,
        eventsPerDay,
        eventsThisMonth,
        eventTypes,
        eventApprovalStatus,
        eventParticipants,
        eventCapacityUtilization
      }
    });
  } catch (error) {
    logger.error('[Applicant Stats Error]', error);
    res.status(500).json({ message: 'Failed to fetch applicant statistics' });
  }
};
