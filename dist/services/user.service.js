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
exports.getProfile = exports.findUserByEmail = exports.createUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../config/db"));
const createUser = (userInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const { first_name, last_name, email, password } = userInfo;
    const hashPassword = bcryptjs_1.default.hashSync(password, 12);
    const user = yield (0, db_1.default)("users").insert({
        first_name,
        last_name,
        email,
        password: hashPassword,
    });
    return user;
});
exports.createUser = createUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.select("*").from("users").where("email", email).first();
    return user;
});
exports.findUserByEmail = findUserByEmail;
const getProfile = (userData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield findUserByEmail(userData.email);
    delete user.password;
    return user;
});
exports.getProfile = getProfile;
