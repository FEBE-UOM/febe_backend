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
exports.enablerCategoryRouter = void 0;
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const validation_helper_1 = require("../helpers/validation.helper");
const enabler_category_schema_1 = require("../schemas/enabler-category.schema");
const enabler_designation_route_1 = require("./enabler_designation.route");
const router = (0, express_1.Router)();
exports.enablerCategoryRouter = router;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const categories = yield enabler_category_schema_1.EnablerCategory.find();
        return res.json(categories);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'invalid object id' });
        }
        const category = yield enabler_category_schema_1.EnablerCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'category with id not found' });
        }
        return res.json(category);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { error } = (0, validation_helper_1.validateEnablerCategory)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const existingCategory = yield enabler_category_schema_1.EnablerCategory.findOne({ name: body.name });
        if (existingCategory) {
            return res
                .status(400)
                .send({ message: 'category with this name already found' });
        }
        const newCategory = new enabler_category_schema_1.EnablerCategory({ name: body.name });
        yield newCategory.save();
        return res.json(newCategory);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.put('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'invalid object id' });
        }
        const body = req.body;
        const { error } = (0, validation_helper_1.validateEnablerCategory)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const category = yield enabler_category_schema_1.EnablerCategory.findById(id);
        if (!category) {
            return res.status(404).send({ message: 'category with the id not found' });
        }
        category.name = body.name;
        yield category.save();
        return res.json(category);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.delete('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            return res.status(400).json({ message: 'invalid object id' });
        }
        const category = yield enabler_category_schema_1.EnablerCategory.findById(id);
        if (!category) {
            return res.status(404).send({ message: 'category with the id not found' });
        }
        yield category.delete();
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.use('/:categoryId/enabler-designations', enabler_designation_route_1.enablerDesignationRouter);
