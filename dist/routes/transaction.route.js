"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const transaction_controller_1 = require("../controllers/transaction.controller");
const auth_1 = __importDefault(require("../middlewares/auth"));
const router = express_1.default.Router();
router.get("/transactions", [auth_1.default], transaction_controller_1.getTheTransactions);
exports.default = router;
