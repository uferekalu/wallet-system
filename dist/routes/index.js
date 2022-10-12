"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_route_1 = __importDefault(require("./user.route"));
const wallet_route_1 = __importDefault(require("./wallet.route"));
const transaction_route_1 = __importDefault(require("./transaction.route"));
const router = express_1.default.Router();
router.use(user_route_1.default);
router.use(wallet_route_1.default);
router.use(transaction_route_1.default);
router.get('/', (req, res) => {
    return res.status(200).json({ message: 'E-Wallet System' });
});
exports.default = router;
