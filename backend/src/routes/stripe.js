import express from 'express'
import { auth } from '../middleware/auth.js'
import { createPaymentIntent, retrievePaymentIntent } from '../controllers/stripeController.js'

const router = express.Router()

// Create a PaymentIntent
router.post('/create-payment-intent', auth, createPaymentIntent)

// Retrieve a PaymentIntent
router.get('/payment-intent/:paymentIntentId', auth, retrievePaymentIntent)

export default router
