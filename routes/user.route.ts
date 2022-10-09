import express from "express";
import { login, register, userProfile } from "../controllers/user.controller";
import auth from "../middlewares/auth";
import {
  loginValidation,
  registerValidation,
} from "../validation/user.validation";

const router = express.Router();

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.get("/auth/profile", [auth], userProfile);

export default router;
