import express from 'express'
import userRoute from './user.route'
const router = express.Router()

router.use(userRoute)

router.get('/', (req, res) => {
    return res.status(200).json({ message: 'E-Wallet System' });
});

export default router