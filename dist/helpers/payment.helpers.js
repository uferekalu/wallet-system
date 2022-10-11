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
exports.verifyPayment = exports.makePayment = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const randomstring_1 = __importDefault(require("randomstring"));
(0, dotenv_1.config)();
const FlutterwaveKey = process.env.FLUTTERWAVE_KEY;
/**
 * Make Payment with flutterwave
 *
 * @param {Integer} amount
 * @param {Object} authenticatedUser
 * @param {String} redirect_url
 * @param {String} description
 * @returns {String}
 */
const makePayment = (amount, authenticatedUser, redirect_url, description) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const generatedTransactionReference = randomstring_1.default.generate({
            length: 10,
            charset: "alphanumeric",
            capitalization: "uppercase",
        });
        const paymentLink = yield (0, axios_1.default)({
            method: "post",
            url: "https://api.flutterwave.com/v3/payments",
            data: {
                tx_ref: `PID-${generatedTransactionReference}`,
                amount: amount,
                currency: "NGN",
                redirect_url: redirect_url,
                payment_options: "card",
                customer: {
                    email: authenticatedUser.email,
                    name: authenticatedUser.first_name + " " + authenticatedUser.last_name,
                },
                customizations: {
                    title: "Wallet System",
                    description: description,
                },
            },
            headers: {
                Authorization: `Bearer ${FlutterwaveKey}`,
                Accept: "application/json",
            },
        });
        return paymentLink.data.data.link;
    }
    catch (error) {
        console.error("MakePayment error: ", error.message);
        throw new Error(error);
    }
});
exports.makePayment = makePayment;
/**
 * Verify Payment with flutterwave
 *
 * @param {Integer} transactionId
 * @returns {Object}
 */
const verifyPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const paymentVerification = yield (0, axios_1.default)({
            method: "get",
            url: `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
            headers: {
                Authorization: `Bearer ${FlutterwaveKey}`,
                Accept: "application/json",
            },
        });
        console.log("payment verification: ", paymentVerification.data.data);
        return paymentVerification.data.data;
    }
    catch (error) {
        console.error("Verification error: ", error.message);
        throw new Error(error);
    }
});
exports.verifyPayment = verifyPayment;
