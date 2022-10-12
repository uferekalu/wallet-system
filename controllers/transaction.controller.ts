import { Response } from "express";
import httpStatus from "http-status";
import { getTransactions } from "../services/transaction.service";
import { IReqAuth } from "../types/user-interface";

const getTheTransactions = async (req: IReqAuth, res: Response) => {
  try {
    const transactionData = {
      userId: req.user!.id,
      limit: Number(req.query.limit),
      page: Number(req.query.page),
    };

    const transactions = await getTransactions(transactionData);

    return res.status(httpStatus.OK).send({
      success: true,
      message: "Returned transactions successfully",
      result: transactions,
    });
  } catch (error) {
    console.error("GetTransactions Error ==>", error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
};

export {
    getTheTransactions
}