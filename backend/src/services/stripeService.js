import stripe from '../config/stripe.js'

class StripeService {
  async createPaymentIntent(amount, currency = 'vnd') {
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount * 100, // Convert to smallest currency unit (cents)
        currency,
        automatic_payment_methods: {
          enabled: true
        }
      })
      return paymentIntent
    } catch (error) {
      console.error('Error creating payment intent:', error)
      throw error
    }
  }

  async retrievePaymentIntent(paymentIntentId) {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
      return paymentIntent
    } catch (error) {
      console.error('Error retrieving payment intent:', error)
      throw error
    }
  }
}

export default new StripeService()
