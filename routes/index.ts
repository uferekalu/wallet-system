import express from 'express'
import userRoute from './user.route'
import walletRoute from './wallet.route'
import transactionRoute from './transaction.route'
const router = express.Router()

router.use(userRoute)
router.use(walletRoute)
router.use(transactionRoute)

router.get('/', (req, res) => {
    return res.status(200).json({ message: 'E-Wallet System' });
});

export default router