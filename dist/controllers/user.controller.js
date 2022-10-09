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
exports.userProfile = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const user_service_1 = require("../services/user.service");
const wallet_service_1 = require("../services/wallet.service");
const jwt_1 = __importDefault(require("../config/jwt"));
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ errors: errors.array() });
        }
        const user = yield (0, user_service_1.createUser)(req.body);
        console.log("user ", user);
        yield (0, wallet_service_1.createWallet)(user[0]);
        return res.status(http_status_1.default.CREATED).send({
            success: true,
            message: `User with email: ${req.body.email} has been created successfully`,
        });
    }
    catch (error) {
        console.error("Registration error: ", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req.body);
        if (!errors.isEmpty()) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ errors: errors.array() });
        }
        const { email, password } = req.body;
        const user = yield (0, user_service_1.findUserByEmail)(email);
        if (!user) {
            return res
                .status(http_status_1.default.UNAUTHORIZED)
                .send({ message: "Invalid email or password", success: false });
        }
        const match = yield bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            return res
                .status(http_status_1.default.UNAUTHORIZED)
                .send({ message: "Invalid email or password", success: false });
        }
        const payload = {
            id: user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };
        const token = jsonwebtoken_1.default.sign(payload, jwt_1.default.appKey, {
            expiresIn: "1d",
        });
        return res.status(http_status_1.default.OK).send({
            success: true,
            message: "Logged in successfully!",
            user: payload,
            token,
        });
    }
    catch (error) {
        console.error("Login error: ", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
    }
});
exports.login = login;
const userProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield (0, user_service_1.getProfile)(req.user);
        return res.status(http_status_1.default.OK).send({
            success: true,
            message: "Profile returned successfully",
            profile: user,
        });
    }
    catch (error) {
        console.error("Profile error: ", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
    }
});
exports.userProfile = userProfile;
