import { Response } from "express";
import { IReqAuth } from "../types/user-interface";
import { validationResult } from "express-validator";
import httpStatus from "http-status";
import { fundWallet, setWalletPin, verifyWalletFunding } from "../services/wallet.service";

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

const fundTheWallet = async (req: IReqAuth, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ errors: errors.array() });
    }

    const { amount } = req.body;

    const walletData = {
      amount,
      user: req.user!,
    };

    const paymentLink = await fundWallet(walletData);

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: "Initialized Wallet Funding",
      paymentLink,
    });
  } catch (error) {
    console.error("Fundwallet error: ", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

const verifyTheWalletFunding = async (req: IReqAuth, res: Response) => {
  try {
    const { transaction_id, status, tx_ref } = req.query

    if (!transaction_id || !status || !tx_ref ) {
      return res.status(httpStatus.BAD_REQUEST).send({
        success: false,
        message: "Could not verify payment"
      })
    }

    const walletData = {
      transaction_id: Number(transaction_id),
      status,
      tx_ref,
      user: req.user!
    }

    await verifyWalletFunding(walletData)

    return res.status(httpStatus.CREATED).send({
      success: true,
      message: "Wallent funded successfully!"
    })
  } catch (error) {
    console.error("Verify walleting funding error: ", error)
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error)
  }
}

export { setTheWalletPin, fundTheWallet, verifyTheWalletFunding };
