"use strict";
/**
 * @file applicantScreeningController.ts
 * @description defines the applicant screening controller
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchDocument = exports.getDocumentByCategory = exports.getDocumentByApplicantId = exports.getDocumentById = exports.updateDocument = exports.createDocument = void 0;
const logger_1 = __importDefault(require("../../../middlewares/logger"));
const applicantModel_1 = __importDefault(require("../models/applicantModel"));
const documentModel_1 = __importDefault(require("../models/documentModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const createDocument = async (req, res) => {
    try {
        console.log("req.body", req.body);
        const { category, author_Id, applicant_Id, title, content, tags } = req.body;
        if (!applicant_Id) {
            return res.status(400).json({ message: "Applicant ID is required" });
        }
        if (!category || !author_Id || !applicant_Id || !title) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const applicant = await applicantModel_1.default.findById(applicant_Id);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        const author = await userModel_1.default.findById(author_Id);
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }
        const documentData = {
            category,
            author_Id,
            authorName: `${author?.firstname} ${author?.lastname}`,
            applicant_Id,
            applicantName: `${applicant?.firstname} ${applicant?.lastname}`,
            title,
            content,
            tags,
        };
        const newDocument = await documentModel_1.default.create(documentData);
        if (!newDocument) {
            return res.status(500).json({ message: "Document not created" });
        }
        switch (category) {
            case "screening":
                if (applicant.documentations && applicant.documentations.screening) {
                    applicant.documentations.screening.remarks.push(newDocument._id);
                    applicant.isShortlisted = true;
                }
                break;
            case "interview":
                if (applicant.documentations && applicant.documentations.interview) {
                    applicant.documentations.interview.remarks.push(newDocument._id);
                }
                break;
            case "training":
                if (applicant.documentations && applicant.documentations.training) {
                    applicant.documentations.training.remarks.push(newDocument._id);
                }
                break;
            default:
                if (applicant.documentations && applicant.documentations.others) {
                    applicant.documentations.others.remarks.push(newDocument._id);
                }
                break;
        }
        await applicant.save();
        res.status(201).json({ message: "Document created successfully", document: newDocument });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.createDocument = createDocument;
const updateDocument = async (req, res) => {
    try {
        const documentId = req.params.id;
        const { category, author_Id, applicant_Id, title, content, tags } = req.body;
        if (!documentId) {
            return res.status(400).json({ message: "Document ID is required" });
        }
        if (!category || !author_Id || !applicant_Id || !title) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const applicant = await applicantModel_1.default.findById(applicant_Id);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        const author = await userModel_1.default.findById(author_Id);
        if (!author) {
            return res.status(404).json({ message: "Author not found" });
        }
        const document = await documentModel_1.default.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        const documentData = {
            category,
            author_Id,
            authorName: `${author.firstname} ${author.lastname}`,
            applicant_Id,
            applicantName: `${applicant.firstname} ${applicant.lastname}`,
            title,
            content,
            tags,
        };
        const updatedDocument = await documentModel_1.default.findByIdAndUpdate(documentId, documentData, { new: true });
        if (!updatedDocument) {
            return res.status(500).json({ message: "Document not updated" });
        }
        res.status(200).json({ message: "Document updated successfully", updatedDocument });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.updateDocument = updateDocument;
const getDocumentById = async (req, res) => {
    try {
        const id = req.params.id;
        const documentId = req.params.documentId;
        if (!id) {
            return res.status(400).json({ message: "Applicant ID is required" });
        }
        if (!documentId) {
            return res.status(400).json({ message: "Document ID is required" });
        }
        const applicant = await applicantModel_1.default.findById(id);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        const document = await documentModel_1.default.findById(documentId);
        if (!document) {
            return res.status(404).json({ message: "Document not found" });
        }
        res.status(200).json({ message: "Document retrieved successfully", document });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getDocumentById = getDocumentById;
const getDocumentByApplicantId = async (req, res) => {
    try {
        const applicantID = req.params.applicantId;
        const category = req.params.category;
        if (!applicantID) {
            return res.status(400).json({ message: "Applicant ID is required" });
        }
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }
        const applicant = await applicantModel_1.default.findById(applicantID);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // Get Document IDs from the applicant's documentations
        const documentations = applicant.documentations;
        const documentIds = documentations?.[category]?.remarks || [];
        if (documentIds.length === 0) {
            return res.status(404).json({ message: `No documents found for this category, ${category}` });
        }
        // Fetch documents by IDs
        const documents = await documentModel_1.default.find({ _id: { $in: documentIds } });
        if (!documents || documents.length === 0) {
            return res.status(404).json({ message: "Documents not found" });
        }
        res.status(200).json({ message: "Documents retrieved successfully", documents });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getDocumentByApplicantId = getDocumentByApplicantId;
const getDocumentByCategory = async (req, res) => {
    try {
        const applicantID = req.params.id;
        const category = req.params.category;
        if (!applicantID) {
            return res.status(400).json({ message: "Applicant ID is required" });
        }
        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }
        const applicant = await applicantModel_1.default.findById(applicantID);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let documents;
        switch (category) {
            case "screening":
                documents = await documentModel_1.default.find({ applicant_Id: applicantID, category: "screening" });
                break;
            case "interview":
                documents = await documentModel_1.default.find({ applicant_Id: applicantID, category: "interview" });
                break;
            case "training":
                documents = await documentModel_1.default.find({ applicant_Id: applicantID, category: "training" });
                break;
            default:
                documents = await documentModel_1.default.find({ applicant_Id: applicantID, category: "others" });
                break;
        }
        if (!documents) {
            return res.status(404).json({ message: "Documents not found" });
        }
        res.status(200).json({ message: "Documents retrieved successfully", documents });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.getDocumentByCategory = getDocumentByCategory;
const searchDocument = async (req, res) => {
    try {
        const applicantID = req.params.id;
        const query = req.query.q;
        if (!applicantID) {
            return res.status(400).json({ message: "Applicant ID is required" });
        }
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }
        const applicant = await applicantModel_1.default.findById(applicantID);
        if (!applicant) {
            return res.status(404).json({ message: "Applicant not found" });
        }
        const documents = await documentModel_1.default.find({ applicant_Id: applicantID, $text: { $search: query } });
        if (!documents) {
            return res.status(404).json({ message: "Documents not found" });
        }
        res.status(200).json({ message: "Documents retrieved successfully", documents });
    }
    catch (error) {
        logger_1.default.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};
exports.searchDocument = searchDocument;
