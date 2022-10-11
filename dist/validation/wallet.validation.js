"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawFund = exports.transferFund = exports.fundWallet = exports.setWalletPin = void 0;
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
const transferFund = [
    (0, express_validator_1.check)("amount", "Amount is required")
        .not()
        .isEmpty()
        .isCurrency()
        .withMessage("amount must be a currency"),
    (0, express_validator_1.check)("wallet_code_or_email", "Please provide either recipient wallet code or email")
        .not()
        .isEmpty(),
    (0, express_validator_1.check)("wallet_pin", "Wallet pin is required").not().isEmpty(),
];
exports.transferFund = transferFund;
const withdrawFund = [
    (0, express_validator_1.check)("amount", "Amount is required")
        .not()
        .isEmpty()
        .isCurrency()
        .withMessage("amount must be a currency"),
    (0, express_validator_1.check)("bank_code", "Bank code is required")
        .not()
        .isEmpty()
        .isLength({ min: 3, max: 3 })
        .withMessage("Bank code contains only 3 numbers"),
    (0, express_validator_1.check)("account_number", "Account number is required")
        .not()
        .isEmpty()
        .isLength({ min: 10, max: 10 })
        .withMessage("Account number contains only 10 numbers"),
    (0, express_validator_1.check)("wallet_pin", "Wallet pin is required").not().isEmpty(),
];
exports.withdrawFund = withdrawFund;
