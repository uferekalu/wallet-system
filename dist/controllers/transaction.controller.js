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
exports.getTheTransactions = void 0;
const http_status_1 = __importDefault(require("http-status"));
const transaction_service_1 = require("../services/transaction.service");
const getTheTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactionData = {
            userId: req.user.id,
            limit: Number(req.query.limit),
            page: Number(req.query.page),
        };
        const transactions = yield (0, transaction_service_1.getTransactions)(transactionData);
        return res.status(http_status_1.default.OK).send({
            success: true,
            message: "Returned transactions successfully",
            result: transactions,
        });
    }
    catch (error) {
        console.error("GetTransactions Error ==>", error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).send(error);
    }
});
exports.getTheTransactions = getTheTransactions;
