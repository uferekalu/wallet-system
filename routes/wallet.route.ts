import express from 'express'
import { setTheWalletPin } from '../controllers/wallet.controller'
import auth from '../middlewares/auth'
import { setWalletPin } from '../validation/wallet.validation'

const router = express.Router()

router.post("/wallet/setpin", [auth], setWalletPin, setTheWalletPin)

export default router