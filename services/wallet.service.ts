import { config } from "dotenv";
import db from "../config/db";
import { FundData, VerifyWalletData, Wallet, WalletData } from "../types/wallet-interface";
import randomstring from "randomstring";
import bcrypt from "bcryptjs";
import { makePayment, verifyPayment } from "../helpers/payment.helpers";

config();

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

const fundWallet = async (walletData: FundData) => {
  const user = walletData.user;
  const amount = walletData.amount;

  const appUrl = process.env.APP_URL
    ? process.env.APP_URL
    : "http://localhost:3000";

  const paymentLink = await makePayment(
    amount!,
    user,
    `${appUrl}/wallet/verify`,
    "Wallet Funding"
  );

  return paymentLink;
};

/**
 * Verify Wallet Funding
 * @param {Object} walletData
 * @returns {Promise<Wallet>}
 */

const verifyWalletFunding = async (walletData: VerifyWalletData) => {
  const user = walletData.user;

  const payment = await verifyPayment(walletData.transaction_id);

  console.log("payment details: ", payment)

  if (payment.customer.email !== user.email) {
    return Promise.reject({
      success: false,
      message: "Could not verify payment",
    });
  }

  const transaction = await db("transactions")
    .where("user_id", user.id)
    .where("transaction_code", payment.id)
    .first();

  if (!transaction) {
    await db("wallets")
      .where("user_id", user.id)
      .increment("balance", payment.amount);

    await db("transactions").insert({
      user_id: user.id,
      transaction_code: payment.id,
      transaction_reference: payment.tx_ref,
      amount: payment.amount,
      description: "Wallet Funding",
      status: payment.status,
      payment_method: payment.payment_type,
      is_inflow: true,
    });
  }
  return payment;
};

export { createWallet, setWalletPin, fundWallet, verifyWalletFunding };
