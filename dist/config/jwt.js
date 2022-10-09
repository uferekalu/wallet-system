"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const jwtConfig = {
    appKey: process.env.APP_SECRET_KEY || 'secret'
};
exports.default = jwtConfig;
