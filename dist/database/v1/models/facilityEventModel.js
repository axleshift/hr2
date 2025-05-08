"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const EVENT_TYPES = ['Initial Interview', 'Final Interview', 'Technical Interview', 'Panel Interview', 'Behavioral Interview', 'Orientation', 'Other'];
const facilityEventsSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: EVENT_TYPES,
        default: 'Other'
    },
    description: {
        type: String
    },
    date: {
        type: Date,
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    isApproved: {
        status: {
            type: Boolean,
            default: false
        },
        approvedBy: {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
    capacity: {
        type: Number,
        required: true
    },
    participants: [
        {
            applicant: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Applicant'
            },
            mail: {
                sent: {
                    type: Boolean,
                    default: false,
                },
                reason: {
                    type: String
                }
            }
        }
    ],
    facility: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Facility',
        required: true
    },
    timeslot: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Timeslot'
    },
    emailSent: {
        status: {
            type: Boolean,
            default: false
        },
        history: [
            {
                date: {
                    type: Date,
                    default: () => new Date()
                },
                content: {
                    type: String,
                }
            }
        ]
    },
}, {
    timestamps: true,
});
exports.default = mongoose_1.default.model('FacilityEvent', facilityEventsSchema);
