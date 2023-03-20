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
exports.finderRouter = void 0;
const express_1 = require("express");
const user_schema_1 = require("../schemas/user.schema");
const router = (0, express_1.Router)();
exports.finderRouter = router;
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { latitude, longitude, radius, type } = req.query;
        if (!latitude || !longitude || !radius || !type) {
            return res
                .status(400)
                .json({ message: 'latitude, longitude, type and radius is required' });
        }
        const nearByUsers = yield user_schema_1.Users.find({
            location: {
                $near: {
                    $maxDistance: radius,
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude],
                    },
                },
            },
            type,
        });
        return res.json(nearByUsers);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
