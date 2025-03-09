import express from 'express'
import { fetchAndStoreFNOData, getStocks } from '../controllers/stock.contollers.js'
import verifyUser from '../middlewares/verifyUser.middleware.js'

const router = express.Router()


router.get('/get-stocks', verifyUser, getStocks )
router.get('/get-fno-stocks', fetchAndStoreFNOData );

export default router