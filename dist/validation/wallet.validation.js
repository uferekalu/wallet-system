"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fundWallet = exports.setWalletPin = void 0;
const express_validator_1 = require("express-validator");
const setWalletPin = [
    (0, express_validator_1.check)("pin", "Pin is required")
        .not()
        .isEmpty()
        .isLength({ min: 4, max: 4 })
        .withMessage("Pin must contain only 4 numbers")
        .isInt()
        .withMessage("Pin must contain only numbers"),
    (0, express_validator_1.check)("confirm_pin", "Confirm pin is required")
        .not()
        .isEmpty()
        .isLength({ min: 4, max: 4 })
        .withMessage("Confirm pin must contain only 4 numbers")
        .isInt()
        .withMessage("Confirm pin must contain only numbers")
        .custom((value, { req }) => {
        if (value !== req.body.pin) {
            return Promise.reject("Confirm pin must be same as pin");
        }
        else {
            return true;
        }
    }),
];
exports.setWalletPin = setWalletPin;
const fundWallet = [
    (0, express_validator_1.check)("amount", "Amount is required")
        .not()
        .isEmpty()
        .isCurrency()
        .withMessage("amount must be a currency"),
];
exports.fundWallet = fundWallet;
