"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const auth_1 = __importDefault(require("../middlewares/auth"));
const user_validation_1 = require("../validation/user.validation");
const router = express_1.default.Router();
router.post("/register", user_validation_1.registerValidation, user_controller_1.register);
router.post("/login", user_validation_1.loginValidation, user_controller_1.login);
router.get("/auth/profile", [auth_1.default], user_controller_1.userProfile);
exports.default = router;
