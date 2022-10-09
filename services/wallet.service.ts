import db from "../config/db";
import { Wallet, WalletData } from "../types/wallet-interface";
import randomstring from "randomstring";
import bcrypt from "bcryptjs";

const createWallet = async (userId: number): Promise<Wallet> => {
  const user = await db.select("*").from("users").where("id", userId).first();

  const generatedWalletCode = randomstring.generate({
    length: 7,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

  const wallet = await db("wallets").insert({
    user_id: user.id,
    wallet_code: generatedWalletCode,
  });

  return wallet;
};

const setWalletPin = async (walletData: WalletData) => {
  const user = walletData.user;
  const pin = walletData.pin.toString();

  const hashPin = await bcrypt.hashSync(pin, 12);

  const wallet = await db("wallets").where("user_id", user.id).first();

  if (!wallet.wallet_pin) {
    await db("wallets")
      .where("user_id", user.id)
      .update({ wallet_pin: hashPin });
  }
  return wallet;
};

export { createWallet, setWalletPin };
