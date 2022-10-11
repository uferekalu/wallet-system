import { config } from "dotenv";
import axios from "axios";
import randomstring from "randomstring";
import { User } from "../types/user-interface";
import { randomlyGeneratedString } from "./randomString";

config();
const FlutterwaveKey = process.env.FLUTTERWAVE_KEY;

/**
 * Make Payment with flutterwave
 *
 * @param {Integer} amount
 * @param {Object} authenticatedUser
 * @param {String} redirect_url
 * @param {String} description
 * @returns {String}
 */

const makePayment = async (
  amount: number,
  authenticatedUser: User,
  redirect_url: string,
  description: string
) => {
  try {
    const generatedTransactionReference = randomstring.generate({
      length: 10,
      charset: "alphanumeric",
      capitalization: "uppercase",
    });
    const paymentLink = await axios({
      method: "post",
      url: "https://api.flutterwave.com/v3/payments",
      data: {
        tx_ref: `PID-${generatedTransactionReference}`,
        amount: amount,
        currency: "NGN",
        redirect_url: redirect_url,
        payment_options: "card",
        customer: {
          email: authenticatedUser.email,
          name:
            authenticatedUser.first_name + " " + authenticatedUser.last_name,
        },
        customizations: {
          title: "Wallet System",
          description: description,
        },
      },
      headers: {
        Authorization: `Bearer ${FlutterwaveKey}`,
        Accept: "application/json",
      },
    });
    return paymentLink.data.data.link;
  } catch (error: any) {
    console.error("MakePayment error: ", error.message);
    throw new Error(error);
  }
};

/**
 * Verify Payment with flutterwave
 *
 * @param {Integer} transactionId
 * @returns {Object}
 */
const verifyPayment = async (transactionId: number) => {
  try {
    const paymentVerification = await axios({
      method: "get",
      url: `https://api.flutterwave.com/v3/transactions/${transactionId}/verify`,
      headers: {
        Authorization: `Bearer ${FlutterwaveKey}`,
        Accept: "application/json",
      },
    });
    console.log("payment verification: ", paymentVerification.data.data);
    return paymentVerification.data.data;
  } catch (error: any) {
    console.error("Verification error: ", error.message);
    throw new Error(error);
  }
};

const withdrawPayment = async (amount: number) => {
  try {
    // mock withdrawal fund response
    const mockWithdrawFundResponnse = {
      status: "success",
      message: "Transfer Queued Successfully",
      data: {
        id: 119090,
        account_number: "0980872718",
        bank_code: "044",
        full_name: "James Emmanuel",
        created_at: "2022-10-11T11:20:34.000Z",
        currency: "NGN",
        amount: amount,
        fee: 10.65,
        status: "NEW",
        reference: `PID-${randomlyGeneratedString()}`,
        meta: null,
        narration: "Payment for goods",
        complete_message: "",
        requires_approval: 0,
        is_approved: 1,
        bank_name: "Guarantee Trust Bank",
      },
    };
    return mockWithdrawFundResponnse.data;
  } catch (error: any) {
    console.error("Withdraw payment error: ", error);
    throw new Error(error);
  }
};

export { makePayment, verifyPayment, withdrawPayment };
