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
var _a, _b, _c;
var _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Utils = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = (_a = process.env.TWILIO_ACCOUNT_SID) !== null && _a !== void 0 ? _a : 'AC763d28faffc836c8807f018c3d6a08cd';
const authToken = (_b = process.env.TWILIO_AUTH_TOKEN) !== null && _b !== void 0 ? _b : '524f8524ef0a002315236c321b663d82';
const twilioPhoneNumber = (_c = process.env.TWILIO_PHONE_NUMBER) !== null && _c !== void 0 ? _c : '+12708187540';
const client = (0, twilio_1.default)(accountSid, authToken);
class Utils {
}
exports.Utils = Utils;
_d = Utils;
Utils.generateOTP = () => {
    // Declare a digits variable
    // which stores all digits
    const NUMBER_OF_DIGITS = 4;
    const digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < NUMBER_OF_DIGITS; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
Utils.sendSms = (to, body) => __awaiter(void 0, void 0, void 0, function* () {
    const message = yield client.messages.create({
        body,
        from: twilioPhoneNumber,
        to,
    });
    return message;
});
