import express from 'express'
import { getTheTransactions } from '../controllers/transaction.controller'
import auth from '../middlewares/auth'

const router = express.Router()
router.get("/transactions", [auth], getTheTransactions)

export default router