import { NextFunction, Response } from "express";
import httpStatus from "http-status";
import db from "../config/db";
import { IReqAuth } from "../types/user-interface";

const setWalletPinMiddleWare = async (
  req: IReqAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const wallet = await db("wallets").where("user_id", user?.id).first();

    if (!wallet.wallet_pin) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message:
          "Please set your wallet pin before performaning any transactions",
      });
    }
    next();
  } catch (error) {
    console.error("Set wallet pin middleware error: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export { setWalletPinMiddleWare };
