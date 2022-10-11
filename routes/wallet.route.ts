import express from "express";
import {
  fundTheWallet,
  setTheWalletPin,
  verifyTheWalletFunding,
} from "../controllers/wallet.controller";
import auth from "../middlewares/auth";
import { setWalletPinMiddleWare } from "../middlewares/set-wallet-pin";
import { fundWallet, setWalletPin } from "../validation/wallet.validation";

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

export default router;
