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
exports.withdrawPayment = exports.verifyPayment = exports.makePayment = void 0;
const dotenv_1 = require("dotenv");
const axios_1 = __importDefault(require("axios"));
const randomstring_1 = __importDefault(require("randomstring"));
const randomString_1 = require("./randomString");
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
const withdrawPayment = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // mock withdrawal fund response
        const mockWithdrawFundResponnse = {
            status: "success",
            message: "Transfer Queued Successfully",
            data: {
                id: 119090,
                account_number: "0980872718",
                bank_code: "044",
                full_name: "James Emmanuel",
                created_at: "2022-10-11T11:20:34.000Z",
                currency: "NGN",
                amount: amount,
                fee: 10.65,
                status: "NEW",
                reference: `PID-${(0, randomString_1.randomlyGeneratedString)()}`,
                meta: null,
                narration: "Payment for goods",
                complete_message: "",
                requires_approval: 0,
                is_approved: 1,
                bank_name: "Guarantee Trust Bank",
            },
        };
        return mockWithdrawFundResponnse.data;
    }
    catch (error) {
        console.error("Withdraw payment error: ", error);
        throw new Error(error);
    }
});
exports.withdrawPayment = withdrawPayment;
