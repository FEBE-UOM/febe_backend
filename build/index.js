"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
const path_1 = __importDefault(require("path"));
const user_route_1 = require("./routes/user.route");
const enabler_category_route_1 = require("./routes/enabler_category.route");
const entrepreneur_industry_route_1 = require("./routes/entrepreneur_industry.route");
const finder_route_1 = require("./routes/finder.route");
const authentication_middleware_1 = require("./middlewares/authentication.middleware");
(0, dotenv_1.config)({ path: path_1.default.resolve(__dirname, '../.env') });
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/users', user_route_1.userRouter);
app.use('/api/enabler-categories', enabler_category_route_1.enablerCategoryRouter);
app.use('/api/entrepreneur-industry', entrepreneur_industry_route_1.entrepreneurIndustryRouter);
app.use('/api/finder', authentication_middleware_1.authenticateUser, finder_route_1.finderRouter);
mongoose_1.default
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion, @typescript-eslint/no-non-null-assertion
    .connect(process.env.DB_STRING)
    .then(() => {
    // eslint-disable-next-line no-console
    console.log('Connected to DB');
})
    .catch((error) => {
    // eslint-disable-next-line no-console
    console.log(error);
});
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000;
app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is listening on port ${PORT}`);
});
