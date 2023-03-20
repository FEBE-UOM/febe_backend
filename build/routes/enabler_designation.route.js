"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enablerDesignationRouter = void 0;
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const validation_helper_1 = require("../helpers/validation.helper");
const enabler_category_schema_1 = require("../schemas/enabler-category.schema");
const enabler_designation_schema_1 = require("../schemas/enabler-designation.schema");
const router = (0, express_1.Router)({ mergeParams: true });
exports.enablerDesignationRouter = router;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(categoryId)) {
            return res.status(400).json({ message: 'invalid object id' });
        }
        const designations = yield enabler_designation_schema_1.EnablerDesignation.find({ category: categoryId });
        return res.json(designations);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, categoryId } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id) || !(0, mongoose_1.isValidObjectId)(categoryId)) {
            return res.status(400).json({ message: 'invalid object id' });
        }
        const designation = yield enabler_designation_schema_1.EnablerDesignation.findOne({
            _id: id,
            category: categoryId,
        });
        if (!designation) {
            return res.status(404).json({ message: 'designation not found' });
        }
        return res.json(designation);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { categoryId } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(categoryId)) {
            return res.status(400).json({ message: 'invalid object id' });
        }
        const body = req.body;
        const { error } = (0, validation_helper_1.validateEnablerDesignation)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const existingDesignation = yield enabler_designation_schema_1.EnablerDesignation.findOne({
            name: body.name,
            category: categoryId,
        });
        if (existingDesignation) {
            return res
                .status(400)
                .send({ message: 'designation with this name already found' });
        }
        const category = yield enabler_category_schema_1.EnablerCategory.findById(categoryId);
        if (!category) {
            return res.status(400).json({ message: 'category not found' });
        }
        const newDesignation = new enabler_designation_schema_1.EnablerDesignation({
            name: body.name,
            category: categoryId,
        });
        yield newDesignation.save();
        category.designations.push(newDesignation.id);
        yield category.save();
        return res.json(newDesignation);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, categoryId } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id) || !(0, mongoose_1.isValidObjectId)(categoryId)) {
            return res.status(400).json({ message: 'invalid object id' });
        }
        const body = req.body;
        const { error } = (0, validation_helper_1.validateEnablerDesignation)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const designation = yield enabler_designation_schema_1.EnablerDesignation.findOne({
            _id: id,
            category: categoryId,
        });
        if (!designation) {
            return res.status(404).json({ message: 'designation not found' });
        }
        designation.name = body.name;
        yield designation.save();
        return res.json(designation);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, categoryId } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id) || !(0, mongoose_1.isValidObjectId)(categoryId)) {
            return res.status(400).json({ message: 'invalid object id' });
        }
        const designation = yield enabler_designation_schema_1.EnablerDesignation.findOne({
            _id: id,
            category: categoryId,
        });
        if (!designation) {
            return res.status(404).json({ message: 'designation not found' });
        }
        yield designation.delete();
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
