"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidation = exports.registerValidation = void 0;
const express_validator_1 = require("express-validator");
const db_1 = __importDefault(require("../config/db"));
const registerValidation = [
    (0, express_validator_1.body)("first_name")
        .isLength({ min: 1 })
        .trim()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    (0, express_validator_1.body)("last_name")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Last name must be specified.")
        .isAlphanumeric()
        .withMessage("Last name has non-alphanumeric characters."),
    (0, express_validator_1.body)("email")
        .isLength({ min: 1 })
        .trim()
        .withMessage("Email must be specified.")
        .isEmail()
        .withMessage("Email must be a valid email address.")
        .custom((value) => {
        return db_1.default
            .select("*")
            .from("users")
            .where("email", value)
            .first()
            .then((user) => {
            if (user) {
                return Promise.reject("Email is already in use");
            }
        });
    }),
    (0, express_validator_1.body)("password")
        .isLength({ min: 6 })
        .trim()
        .withMessage("Password must be 6 characters or greater."),
    // Sanitize fields.
    (0, express_validator_1.sanitizeBody)("first_name").escape(),
    (0, express_validator_1.sanitizeBody)("last_name").escape(),
    (0, express_validator_1.sanitizeBody)("email").escape(),
    (0, express_validator_1.sanitizeBody)("password").escape(),
];
exports.registerValidation = registerValidation;
const loginValidation = [
    (0, express_validator_1.check)("email", "Please enter a valid email").isEmail(),
    (0, express_validator_1.check)("password", "Password is required").not().isEmpty(),
];
exports.loginValidation = loginValidation;
