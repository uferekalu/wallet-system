import express from "express";
import {
  fundTheWallet,
  setTheWalletPin,
  transferTheFund,
  verifyTheWalletFunding,
  withdrawTheFund,
} from "../controllers/wallet.controller";
import auth from "../middlewares/auth";
import { setWalletPinMiddleWare } from "../middlewares/set-wallet-pin";
import {
  fundWallet,
  setWalletPin,
  transferFund,
  withdrawFund,
} from "../validation/wallet.validation";

const router = express.Router();

router.post("/wallet/setpin", [auth], setWalletPin, setTheWalletPin);
router.post(
  "/wallet/fund",
  [auth],
  setWalletPinMiddleWare,
  fundWallet,
  fundTheWallet
);
router.get("/wallet/verify", [auth], verifyTheWalletFunding);
router.post(
  "/wallet/transfer",
  [auth],
  setWalletPinMiddleWare,
  transferFund,
  transferTheFund
);
router.post(
  "/wallet/withdraw",
  [auth],
  setWalletPinMiddleWare,
  withdrawFund,
  withdrawTheFund
);

export default router;
