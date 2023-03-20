"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnablerCategory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enablerCategory = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    designations: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'enabler_designations',
        },
    ],
});
const EnablerCategory = mongoose_1.default.model('enabler_category', enablerCategory);
exports.EnablerCategory = EnablerCategory;
