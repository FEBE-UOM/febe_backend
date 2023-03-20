"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntrepreneurIndustry = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const entrepreneurIndustry = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
});
const EntrepreneurIndustry = mongoose_1.default.model('entrepreneur_industry', entrepreneurIndustry);
exports.EntrepreneurIndustry = EntrepreneurIndustry;
