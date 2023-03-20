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
exports.authenticateUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_schema_1 = require("../schemas/user.schema");
const authenticateUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.get('Authorization');
        if (!authHeader) {
            return res.status(401).json({ message: 'authentication token missing' });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'token missing' });
        }
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
        const payload = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
        if (!payload) {
            return res.status(401).json({ message: 'invalid access token' });
        }
        const user = yield user_schema_1.Users.findById(payload.id);
        if (!user) {
            return res.status(401).json({ message: 'user not found' });
        }
        req.user = payload;
        next();
    }
    catch (error) {
        return res.status(401).json({ message: 'invalid access token' });
    }
});
exports.authenticateUser = authenticateUser;
