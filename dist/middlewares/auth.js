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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const jwt_1 = __importDefault(require("../config/jwt"));
const user_service_1 = require("../services/user.service");
const auth = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token = req.headers["authorization"];
        if (!token) {
            return res.status(http_status_1.default.UNAUTHORIZED).send({
                success: false,
                message: "Authorization is required for this resources",
            });
        }
        const decodeToken = (yield jsonwebtoken_1.default.verify(token.split(" ")[1], jwt_1.default.appKey));
        const user = yield (0, user_service_1.findUserByEmail)(decodeToken.email);
        if (!user) {
            return res.status(http_status_1.default.UNAUTHORIZED).send({
                success: false,
                message: "Invalid authorization token. Please try again",
            });
        }
        req.user = user;
        next();
    }
    catch (error) {
        console.error("Auth Middleware error: ", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
    }
});
exports.default = auth;
