import db from "../config/db";
import { TransactionData } from "../types/transaction-interface";

const getTransactions = async (transactionData: TransactionData) => {
  const transactions = await db("transactions")
    .where("user_id", transactionData.userId)
    .paginate({
      perPage: transactionData.limit,
      currentPage: transactionData.page,
      isLengthAware: true,
    });
  return transactions;
};

export {
    getTransactions
}