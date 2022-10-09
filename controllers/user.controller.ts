import { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import {
  createUser,
  findUserByEmail,
  getProfile,
} from "../services/user.service";
import { createWallet } from "../services/wallet.service";
import jwtConfig from "../config/jwt";
import { IReqAuth } from "../types/user-interface";

const register = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const user = await createUser(req.body);

    console.log("user ", user)

    await createWallet(user[0]);

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: `User with email: ${req.body.email} has been created successfully`,
    });
  } catch (error) {
    console.error("Registration error: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req.body);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Invalid email or password", success: false });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res
        .status(httpStatus.UNAUTHORIZED)
        .send({ message: "Invalid email or password", success: false });
    }

    const payload = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
    };

    const token = jwt.sign(payload, jwtConfig.appKey, {
      expiresIn: "1d",
    });

    return res.status(httpStatus.OK).send({
      success: true,
      message: "Logged in successfully!",
      user: payload,
      token,
    });
  } catch (error) {
    console.error("Login error: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const userProfile = async (req: IReqAuth, res: Response) => {
  try {
    const user = await getProfile(req.user!);

    return res.status(httpStatus.OK).send({
      success: true,
      message: "Profile returned successfully",
      profile: user,
    });
  } catch (error) {
    console.error("Profile error: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export { register, login, userProfile };
