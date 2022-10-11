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
exports.verifyWalletFunding = exports.fundWallet = exports.setWalletPin = exports.createWallet = void 0;
const dotenv_1 = require("dotenv");
const db_1 = __importDefault(require("../config/db"));
const randomstring_1 = __importDefault(require("randomstring"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const payment_helpers_1 = require("../helpers/payment.helpers");
(0, dotenv_1.config)();
const createWallet = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.default.select("*").from("users").where("id", userId).first();
    const generatedWalletCode = randomstring_1.default.generate({
        length: 7,
        charset: "alphanumeric",
        capitalization: "uppercase",
    });
    const wallet = yield (0, db_1.default)("wallets").insert({
        user_id: user.id,
        wallet_code: generatedWalletCode,
    });
    return wallet;
});
exports.createWallet = createWallet;
const setWalletPin = (walletData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = walletData.user;
    const pin = walletData.pin.toString();
    const hashPin = yield bcryptjs_1.default.hashSync(pin, 12);
    const wallet = yield (0, db_1.default)("wallets").where("user_id", user.id).first();
    if (!wallet.wallet_pin) {
        yield (0, db_1.default)("wallets")
            .where("user_id", user.id)
            .update({ wallet_pin: hashPin });
    }
    return wallet;
});
exports.setWalletPin = setWalletPin;
const fundWallet = (walletData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = walletData.user;
    const amount = walletData.amount;
    const appUrl = process.env.APP_URL
        ? process.env.APP_URL
        : "http://localhost:3000";
    const paymentLink = yield (0, payment_helpers_1.makePayment)(amount, user, `${appUrl}/wallet/verify`, "Wallet Funding");
    return paymentLink;
});
exports.fundWallet = fundWallet;
/**
 * Verify Wallet Funding
 * @param {Object} walletData
 * @returns {Promise<Wallet>}
 */
const verifyWalletFunding = (walletData) => __awaiter(void 0, void 0, void 0, function* () {
    const user = walletData.user;
    const payment = yield (0, payment_helpers_1.verifyPayment)(walletData.transaction_id);
    console.log("payment details: ", payment);
    if (payment.customer.email !== user.email) {
        return Promise.reject({
            success: false,
            message: "Could not verify payment",
        });
    }
    const transaction = yield (0, db_1.default)("transactions")
        .where("user_id", user.id)
        .where("transaction_code", payment.id)
        .first();
    if (!transaction) {
        yield (0, db_1.default)("wallets")
            .where("user_id", user.id)
            .increment("balance", payment.amount);
        yield (0, db_1.default)("transactions").insert({
            user_id: user.id,
            transaction_code: payment.id,
            transaction_reference: payment.tx_ref,
            amount: payment.amount,
            description: "Wallet Funding",
            status: payment.status,
            payment_method: payment.payment_type,
            is_inflow: true,
        });
    }
    return payment;
});
exports.verifyWalletFunding = verifyWalletFunding;
