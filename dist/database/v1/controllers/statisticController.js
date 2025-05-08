"use strict";
/**
 * @file applicantController.ts
 * @description Controller for handling applicant data
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statistics = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const jobpostingModel_1 = __importDefault(require("../models/jobpostingModel"));
const facilityEventModel_1 = __importDefault(require("../models/facilityEventModel"));
const statistics = async (req, res) => {
    try {
        const now = new Date();
        const lastWeek = new Date(now);
        lastWeek.setDate(now.getDate() - 7);
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        // Applicants
        const totalApplicants = await applicantModel_1.default.countDocuments();
        const recentApplicants = await applicantModel_1.default.find({
            createdAt: { $gte: lastWeek }
        })
            .sort({ createdAt: -1 })
            .limit(10) // optional: limit to top 10 most recent
            .select('firstname lastname email phone jobAppliedFor yearsOfExperience highestQualification statuses createdAt');
        const applicantsPerDay = await applicantModel_1.default.aggregate([
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
        const applicantsThisMonth = await applicantModel_1.default.countDocuments({
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });
        const journeyProgression = await applicantModel_1.default.aggregate([
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
        ]);
        const currentStages = await applicantModel_1.default.aggregate([
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
        ]);
        const experienceHistogram = await applicantModel_1.default.aggregate([
            {
                $bucket: {
                    groupBy: "$yearsOfExperience",
                    boundaries: [0, 1, 3, 5, 10, 15, 20, 30],
                    default: "30+",
                    output: { count: { $sum: 1 } }
                }
            }
        ]);
        const jobHistogram = await applicantModel_1.default.aggregate([
            {
                $group: {
                    _id: "$jobAppliedFor",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 } // top 10
        ]);
        const qualificationHistogram = await applicantModel_1.default.aggregate([
            {
                $group: {
                    _id: "$highestQualification",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);
        const graduationHistogram = await applicantModel_1.default.aggregate([
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
        const monthlyHistogram = await applicantModel_1.default.aggregate([
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
        const avgExperience = await applicantModel_1.default.aggregate([
            { $group: { _id: null, avgExperience: { $avg: "$yearsOfExperience" } } }
        ]);
        const genderStats = await applicantModel_1.default.aggregate([
            { $group: { _id: "$gender", count: { $sum: 1 } } }
        ]);
        const avgSalary = await applicantModel_1.default.aggregate([
            { $group: { _id: null, avgSalary: { $avg: "$salaryExpectation" } } }
        ]);
        const locationStats = await applicantModel_1.default.aggregate([
            { $group: { _id: "$preferredWorkLocation", count: { $sum: 1 } } }
        ]);
        const sourceStats = await applicantModel_1.default.aggregate([
            { $group: { _id: "$source", count: { $sum: 1 } } }
        ]);
        const timeToHire = await applicantModel_1.default.aggregate([
            { $match: { "statuses.journey.isHired": true } },
            { $project: { timeToHire: { $subtract: ["$hiredAt", "$createdAt"] } } },
            { $group: { _id: null, avgTimeToHire: { $avg: "$timeToHire" } } }
        ]);
        // jobpostings
        const totalJobPostings = await jobpostingModel_1.default.countDocuments();
        // Active job postings (not expired)
        const activeJobPostings = await jobpostingModel_1.default.countDocuments({
            isExpired: false,
            status: { $ne: "expired" },
        });
        // Expired job postings
        const expiredJobPostings = await jobpostingModel_1.default.countDocuments({
            isExpired: true,
        });
        const recentJobs = await jobpostingModel_1.default.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select('title type location salary_min salary_max schedule_start schedule_end status createdAt');
        // Job postings grouped by type (e.g., full-time, part-time)
        const jobTypes = await jobpostingModel_1.default.aggregate([
            { $group: { _id: "$type", count: { $sum: 1 } } },
        ]);
        // Average salary ranges (min and max)
        // Events
        const totalEvents = await facilityEventModel_1.default.countDocuments();
        const recentEvents = await facilityEventModel_1.default.find({
            createdAt: { $gte: lastWeek }
        })
            .sort({ createdAt: -1 })
            .limit(10) // Optional: limit to top 10 most recent events
            .select('name type date facility capacity isAvailable isApproved createdAt')
            .populate({
            path: "facility",
            model: "Facility"
        });
        const eventsPerDay = await facilityEventModel_1.default.aggregate([
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
        const eventsThisMonth = await facilityEventModel_1.default.countDocuments({
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });
        const eventTypes = await facilityEventModel_1.default.aggregate([
            {
                $group: {
                    _id: "$type",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        const eventApprovalStatus = await facilityEventModel_1.default.aggregate([
            {
                $group: {
                    _id: "$isApproved.status",
                    count: { $sum: 1 }
                }
            }
        ]);
        const eventParticipants = await facilityEventModel_1.default.aggregate([
            { $unwind: "$participants" },
            {
                $group: {
                    _id: "$participants.applicant",
                    count: { $sum: 1 }
                }
            }
        ]);
        // Event capacity utilization (how many slots are filled)
        const eventCapacityUtilization = await facilityEventModel_1.default.aggregate([
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
    }
    catch (error) {
        logger_1.default.error('[Applicant Stats Error]', error);
        res.status(500).json({ message: 'Failed to fetch applicant statistics' });
    }
};
exports.statistics = statistics;
