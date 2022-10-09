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
exports.setTheWalletPin = void 0;
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
