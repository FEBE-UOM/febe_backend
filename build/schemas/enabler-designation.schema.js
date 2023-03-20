"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnablerDesignation = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const enablerDesignation = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'enabler_category',
    },
});
const EnablerDesignation = mongoose_1.default.model('enabler_designation', enablerDesignation);
exports.EnablerDesignation = EnablerDesignation;
