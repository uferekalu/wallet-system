import { Response } from "express";
import { IReqAuth } from "../types/user-interface";
import { validationResult } from "express-validator";
import httpStatus from "http-status";
import { setWalletPin } from "../services/wallet.service";

const setTheWalletPin = async (req: IReqAuth, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }
    const { pin } = req.body;

    const walletData = {
      pin,
      user: req.user!,
    };

    await setWalletPin(walletData);

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: "Wallet pin set successfully!",
    });
  } catch (error) {
    console.error("Set wallet pin error: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export { setTheWalletPin };
