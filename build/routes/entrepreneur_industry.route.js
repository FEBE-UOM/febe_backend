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
exports.entrepreneurIndustryRouter = void 0;
const express_1 = require("express");
const mongoose_1 = require("mongoose");
const validation_helper_1 = require("../helpers/validation.helper");
const entrepreneur_industry_schema_1 = require("../schemas/entrepreneur-industry.schema");
const router = (0, express_1.Router)();
exports.entrepreneurIndustryRouter = router;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const industries = yield entrepreneur_industry_schema_1.EntrepreneurIndustry.find();
        return res.json(industries);
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
        const industry = yield entrepreneur_industry_schema_1.EntrepreneurIndustry.findById(id);
        if (!industry) {
            return res.status(404).json({ message: 'industry with id not found' });
        }
        return res.json(industry);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { error } = (0, validation_helper_1.validateEntrepreneurIndustry)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const existingindustry = yield entrepreneur_industry_schema_1.EntrepreneurIndustry.findOne({
            name: body.name,
        });
        if (existingindustry) {
            return res
                .status(400)
                .send({ message: 'industry with this name already found' });
        }
        const newindustry = new entrepreneur_industry_schema_1.EntrepreneurIndustry({ name: body.name });
        yield newindustry.save();
        return res.json(newindustry);
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
        const { error } = (0, validation_helper_1.validateEntrepreneurIndustry)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const industry = yield entrepreneur_industry_schema_1.EntrepreneurIndustry.findById(id);
        if (!industry) {
            return res.status(404).send({ message: 'industry with the id not found' });
        }
        industry.name = body.name;
        yield industry.save();
        return res.json(industry);
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
        const industry = yield entrepreneur_industry_schema_1.EntrepreneurIndustry.findById(id);
        if (!industry) {
            return res.status(404).send({ message: 'industry with the id not found' });
        }
        yield industry.delete();
        return res.status(204).send();
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
