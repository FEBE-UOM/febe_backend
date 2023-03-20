"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUserLocation = exports.validateUpdateUser = exports.validateEntrepreneurIndustry = exports.validateEnablerDesignation = exports.validateEnablerCategory = exports.validateUserVerifyOtp = exports.validateUserLogin = void 0;
const joi_1 = __importDefault(require("@hapi/joi"));
// Login Validation
const validateUserLogin = (data) => {
    const schema = joi_1.default.object({
        phonenumber: joi_1.default.string().min(10).max(13).required(),
        type: joi_1.default.string(),
    });
    return schema.validate(data);
};
exports.validateUserLogin = validateUserLogin;
const validateUserVerifyOtp = (data) => {
    const schema = joi_1.default.object({
        phonenumber: joi_1.default.string().min(10).max(13).required(),
        otp: joi_1.default.string().min(4).max(6).required(),
    });
    return schema.validate(data);
};
exports.validateUserVerifyOtp = validateUserVerifyOtp;
const validateEnablerCategory = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).required(),
    });
    return schema.validate(data);
};
exports.validateEnablerCategory = validateEnablerCategory;
const validateEnablerDesignation = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).required(),
    });
    return schema.validate(data);
};
exports.validateEnablerDesignation = validateEnablerDesignation;
const validateEntrepreneurIndustry = (data) => {
    const schema = joi_1.default.object({
        name: joi_1.default.string().min(3).required(),
    });
    return schema.validate(data);
};
exports.validateEntrepreneurIndustry = validateEntrepreneurIndustry;
const validateUpdateUser = (data) => {
    const enablerSchema = joi_1.default.object({
        about: joi_1.default.string(),
        linkedInURL: joi_1.default.string(),
        portfolioURL: joi_1.default.string(),
        aadhar: {
            front: joi_1.default.string(),
            back: joi_1.default.string(),
        },
        designation: joi_1.default.string(),
    });
    const entrepreneurSchema = joi_1.default.object({
        about: joi_1.default.string(),
        industry: joi_1.default.string(),
        companyName: joi_1.default.string(),
        websiteURL: joi_1.default.string(),
        linkedInURL: joi_1.default.string(),
        companyRegistrationDocument: {
            url: joi_1.default.string(),
        },
    });
    const schema = joi_1.default.object({
        name: joi_1.default.string(),
        dateOfBirth: joi_1.default.date(),
        enabler: enablerSchema,
        entrepreneur: entrepreneurSchema,
    });
    return schema.validate(data);
};
exports.validateUpdateUser = validateUpdateUser;
const validateUserLocation = (data) => {
    const schema = joi_1.default.object({
        latitude: joi_1.default.number().required(),
        longitude: joi_1.default.number().required(),
    });
    return schema.validate(data);
};
exports.validateUserLocation = validateUserLocation;
