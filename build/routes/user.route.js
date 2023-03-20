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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validation_helper_1 = require("../helpers/validation.helper");
const user_schema_1 = require("../schemas/user.schema");
const utils_helper_1 = require("../helpers/utils.helper");
const otp_schema_1 = require("../schemas/otp.schema");
const authentication_middleware_1 = require("../middlewares/authentication.middleware");
const router = (0, express_1.Router)();
exports.userRouter = router;
// Register
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { error } = (0, validation_helper_1.validateUserLogin)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        let currentUser = yield user_schema_1.Users.findOne({
            phoneNumber: body.phonenumber,
        });
        if (!currentUser) {
            currentUser = new user_schema_1.Users({
                phoneNumber: body.phonenumber,
                type: body.type,
            });
            yield currentUser.save();
        }
        const code = utils_helper_1.Utils.generateOTP();
        const message = yield utils_helper_1.Utils.sendSms(body.phonenumber, `Your OTP for FEBE login is: ${code.toString()}`);
        const otp = new otp_schema_1.Otps({
            code,
            expiresAt: Date.now() + 60 * 1000,
            isActive: true,
            phonenumber: body.phonenumber,
        });
        yield otp.save();
        return res.status(200).json({
            messageId: message.sid,
        });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
// Verify OTP
router.post('/verify-otp', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = req.body;
        const { error } = (0, validation_helper_1.validateUserVerifyOtp)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const otpDetails = yield otp_schema_1.Otps.findOne({
            phonenumber: body.phonenumber,
            code: body.otp,
            isActive: true,
        });
        if (!otpDetails) {
            return res.status(400).send({ message: 'invalid otp' });
        }
        if (otpDetails.expiresAt.getTime() < Date.now()) {
            return res.status(400).send({ message: 'otp expired' });
        }
        otpDetails.isActive = false;
        yield otpDetails.save();
        const currentUser = yield user_schema_1.Users.findOne({ phoneNumber: body.phonenumber });
        if (!currentUser) {
            return res.status(400).send({ message: 'user not found' });
        }
        // Create and assign a token
        const token = jsonwebtoken_1.default.sign({
            id: currentUser._id,
        }, 
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
        process.env.TOKEN_SECRET);
        return res.send({ 'auth-token': token });
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.put('/', authentication_middleware_1.authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const body = req.body;
        const { error } = (0, validation_helper_1.validateUpdateUser)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        let user = yield user_schema_1.Users.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
        if (!user) {
            return res.status(400).send({ message: 'user not found' });
        }
        yield user_schema_1.Users.updateOne({ _id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.id }, Object.assign(Object.assign({}, body), { isSignupCompleted: true }));
        user = yield user_schema_1.Users.findById((_c = req.user) === null || _c === void 0 ? void 0 : _c.id);
        return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
router.put('/location', authentication_middleware_1.authenticateUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _d;
    try {
        const body = req.body;
        const { error } = (0, validation_helper_1.validateUserLocation)(body);
        if (error) {
            return res.status(400).send({ message: error.details[0].message });
        }
        const user = yield user_schema_1.Users.findById((_d = req.user) === null || _d === void 0 ? void 0 : _d.id);
        if (!user) {
            return res.status(400).send({ message: 'user not found' });
        }
        user.location = {
            coordinates: [body.longitude, body.latitude],
        };
        yield user.save();
        return res.status(200).json(body);
    }
    catch (error) {
        return res.status(500).send({ message: error.message });
    }
}));
