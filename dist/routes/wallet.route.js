"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallet_controller_1 = require("../controllers/wallet.controller");
const auth_1 = __importDefault(require("../middlewares/auth"));
const wallet_validation_1 = require("../validation/wallet.validation");
const router = express_1.default.Router();
router.post("/wallet/setpin", [auth_1.default], wallet_validation_1.setWalletPin, wallet_controller_1.setTheWalletPin);
exports.default = router;
