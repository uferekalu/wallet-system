import { config } from "dotenv";
import axios from "axios";
import randomstring from "randomstring";
import { User } from "../types/user-interface";

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
    console.log("payment verification: ", paymentVerification.data.data)
    return paymentVerification.data.data
  } catch (error: any) {
    console.error("Verification error: ", error.message)
    throw new Error(error)
  }
};

export { makePayment,verifyPayment };
