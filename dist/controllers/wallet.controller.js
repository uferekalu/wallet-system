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
exports.verifyTheWalletFunding = exports.fundTheWallet = exports.setTheWalletPin = void 0;
const express_validator_1 = require("express-validator");
const http_status_1 = __importDefault(require("http-status"));
const wallet_service_1 = require("../services/wallet.service");
const setTheWalletPin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ errors: errors.array() });
        }
        const { pin } = req.body;
        const walletData = {
            pin,
            user: req.user,
        };
        yield (0, wallet_service_1.setWalletPin)(walletData);
        return res.status(http_status_1.default.CREATED).send({
            success: true,
            message: "Wallet pin set successfully!",
        });
    }
    catch (error) {
        console.error("Set wallet pin error: ", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
    }
});
exports.setTheWalletPin = setTheWalletPin;
const fundTheWallet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ errors: errors.array() });
        }
        const { amount } = req.body;
        const walletData = {
            amount,
            user: req.user,
        };
        const paymentLink = yield (0, wallet_service_1.fundWallet)(walletData);
        return res.status(http_status_1.default.CREATED).send({
            success: true,
            message: "Initialized Wallet Funding",
            paymentLink,
        });
    }
    catch (error) {
        console.error("Fundwallet error: ", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
    }
});
exports.fundTheWallet = fundTheWallet;
const verifyTheWalletFunding = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transaction_id, status, tx_ref } = req.query;
        if (!transaction_id || !status || !tx_ref) {
            return res.status(http_status_1.default.BAD_REQUEST).send({
                success: false,
                message: "Could not verify payment"
            });
        }
        const walletData = {
            transaction_id: Number(transaction_id),
            status,
            tx_ref,
            user: req.user
        };
        yield (0, wallet_service_1.verifyWalletFunding)(walletData);
        return res.status(http_status_1.default.CREATED).send({
            success: true,
            message: "Wallent funded successfully!"
        });
    }
    catch (error) {
        console.error("Verify walleting funding error: ", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
    }
});
exports.verifyTheWalletFunding = verifyTheWalletFunding;
