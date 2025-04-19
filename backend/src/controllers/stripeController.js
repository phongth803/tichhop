import stripe from '../config/stripe.js'

export const createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' })
    }

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // ensure amount is an integer
      currency: 'usd',
      payment_method_types: ['card'],
      automatic_payment_methods: {
        enabled: false
      }
    })

    res.json({
      clientSecret: paymentIntent.client_secret
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    res.status(500).json({ error: error.message || 'Error creating payment intent' })
  }
}

export const retrievePaymentIntent = async (req, res) => {
  try {
    const { paymentIntentId } = req.params

    if (!paymentIntentId) {
      return res.status(400).json({ error: 'Payment intent ID is required' })
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
    res.json(paymentIntent)
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    res.status(500).json({ error: error.message || 'Error retrieving payment intent' })
  }
}
