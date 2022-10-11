import { config } from "dotenv";
import db from "../config/db";
import {
  FundData,
  VerifyWalletData,
  Wallet,
  WalletData,
  WalletDataTransfer,
  WalletDataWithdraw,
} from "../types/wallet-interface";
import randomstring from "randomstring";
import bcrypt from "bcryptjs";
import {
  makePayment,
  verifyPayment,
  withdrawPayment,
} from "../helpers/payment.helpers";

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

  console.log("payment details: ", payment);

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

const transferFund = async (walletData: WalletDataTransfer) => {
  const sender = walletData.user;
  const walletCodeOrEmail = walletData.wallet_code_or_email;
  const amount = walletData.amount;
  const walletPin = walletData.wallet_pin;

  let recipient;
  if (walletCodeOrEmail.toString().includes("@")) {
    recipient = await db("users").where("email", walletCodeOrEmail).first();
  } else {
    const recipientWallet = await db("wallets")
      .where("wallet_code", walletCodeOrEmail)
      .first();

    const receipientID = recipientWallet?.user_id || null;

    recipient = await db("users").where("id", receipientID).first();
  }

  if (!recipient) {
    return Promise.reject({
      message: "Recipient not found",
      success: false,
    });
  }

  if (sender.id === recipient.id) {
    return Promise.reject({
      success: false,
      message: "You cannot transfer fund to yourself",
    });
  }

  const senderWallet = await db("wallets").where("user_id", sender.id).first();

  if (senderWallet.balance < amount) {
    return Promise.reject({
      message: "Insufficient Fund",
      success: false,
    });
  }

  // Check if wallet pin is correct
  const match = await bcrypt.compare(
    walletPin.toString(),
    senderWallet.wallet_pin
  );

  if (!match) {
    return Promise.reject({
      message: "Incorrect pin",
      success: false,
    });
  }

  const generatedTransactionReference = randomstring.generate({
    length: 10,
    charset: "alphanumeric",
    capitalization: "uppercase",
  });

  const generatedTransactionCode = randomstring.generate({
    length: 7,
    charset: "numeric",
  });

  // Deduct amount from sender wallet
  await db("wallets").where("user_id", sender.id).decrement("balance", amount);

  // Record the transaction for sender
  await db("transactions").insert({
    user_id: sender.id,
    transaction_code: generatedTransactionCode,
    transaction_reference: `PID-${generatedTransactionReference}`,
    amount: amount,
    description: "Fund Transfer",
    status: "successful",
    payment_method: "wallet",
    is_inflow: false,
  });

  // Add to receipient wallet
  await db("wallets")
    .where("user_id", recipient.id)
    .increment("balance", amount);

  // Record the transaction for recipient
  await db("transactions").insert({
    user_id: recipient.id,
    transaction_code: generatedTransactionCode,
    transaction_reference: `PID-${generatedTransactionReference}`,
    amount: amount,
    description: "Fund Transfer",
    status: "successful",
    payment_method: "wallet",
    is_inflow: true,
  });
};

const withdrawFund = async (walletData: WalletDataWithdraw) => {
  const user = walletData.user;
  const amount = walletData.amount;
  const walletPin = walletData.wallet_pin;

  const userWallet = await db("wallets").where("user_id", user.id).first();

  if (userWallet.balance < amount) {
    return Promise.reject({
      message: "Insufficient fund",
      success: false,
    });
  }

  // Check if wallet pin in correct
  const match = await bcrypt.compare(
    walletPin.toString(),
    userWallet.wallet_pin
  );

  if (!match) {
    return Promise.reject({
      message: "Incorrect Pin",
      success: false,
    });
  }

  const payment = await withdrawPayment(amount);

  const amountToDeduct = payment.amount + payment.fee;

  // Deduct from user wallet
  await db("wallets")
    .where("user_id", user.id)
    .decrement("balance", amountToDeduct);

  await db("transactions").insert({
    user_id: user.id,
    transaction_code: payment.id,
    transaction_reference: payment.reference,
    amount: amountToDeduct,
    description: "Fund Withdrawal",
    status: "successful",
    payment_method: "bank transfer",
    is_inflow: false,
  });
};

export {
  createWallet,
  setWalletPin,
  fundWallet,
  verifyWalletFunding,
  transferFund,
  withdrawFund,
};
