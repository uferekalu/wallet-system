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
exports.setWalletPinMiddleWare = void 0;
const http_status_1 = __importDefault(require("http-status"));
const db_1 = __importDefault(require("../config/db"));
const setWalletPinMiddleWare = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.user;
        const wallet = yield (0, db_1.default)("wallets").where("user_id", user === null || user === void 0 ? void 0 : user.id).first();
        if (!wallet.wallet_pin) {
            return res.status(http_status_1.default.BAD_REQUEST).send({
                success: false,
                message: "Please set your wallet pin before performaning any transactions",
            });
        }
        next();
    }
    catch (error) {
        console.error("Set wallet pin middleware error: ", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
    }
});
exports.setWalletPinMiddleWare = setWalletPinMiddleWare;
