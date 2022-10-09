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
exports.setWalletPin = exports.createWallet = void 0;
const db_1 = __importDefault(require("../config/db"));
const randomstring_1 = __importDefault(require("randomstring"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
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
