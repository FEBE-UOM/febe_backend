"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const geoSchema = new mongoose_1.default.Schema({
    type: {
        type: String,
        default: 'Point',
    },
    coordinates: {
        type: [Number],
    },
});
const aadharSchema = new mongoose_1.default.Schema({
    front: {
        type: String,
    },
    back: {
        type: String,
    },
});
const companyRegistrationSchema = new mongoose_1.default.Schema({
    url: {
        type: String,
    },
});
const enablerSchema = new mongoose_1.default.Schema({
    about: {
        type: String,
        required: true,
    },
    linkedInURL: {
        type: String,
        required: true,
    },
    portfolioURL: {
        type: String,
    },
    aadhar: {
        type: aadharSchema,
    },
    designation: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'enabler_designation',
    },
});
const entrepreneur = new mongoose_1.default.Schema({
    about: {
        type: String,
        required: true,
    },
    industry: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'industry',
    },
    companyName: {
        type: String,
        required: true,
    },
    websiteURL: {
        type: String,
        required: true,
    },
    linkedInURL: {
        type: String,
        required: true,
    },
    companyRegistrationDocument: {
        type: companyRegistrationSchema,
        required: false,
    },
});
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: false,
        min: 6,
        max: 255,
    },
    type: {
        type: String,
        enum: ['enabler', 'entrepreneur', 'enabler_and_entrepreneur'],
    },
    phoneNumber: {
        type: String,
        required: true,
        max: 10,
        min: 10,
    },
    isSignupCompleted: {
        type: Boolean,
        default: false,
    },
    dateOfBirth: { type: Date },
    enabler: {
        type: enablerSchema,
        required: false,
    },
    entrepreneur: {
        type: entrepreneur,
        required: false,
    },
    location: {
        type: geoSchema,
        index: '2dsphere',
    },
}, {
    timestamps: true,
});
const Users = mongoose_1.default.model('users', userSchema);
exports.Users = Users;
