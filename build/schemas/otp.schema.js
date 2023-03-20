"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otps = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpSchema = new mongoose_1.default.Schema({
    phonenumber: {
        type: String,
        required: true,
        max: 10,
        min: 10,
    },
    code: {
        type: String,
        required: true,
        max: 6,
        min: 6,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
const Otps = mongoose_1.default.model('otps', otpSchema);
exports.Otps = Otps;
