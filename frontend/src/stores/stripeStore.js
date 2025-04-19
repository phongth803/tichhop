import { makeAutoObservable } from 'mobx'
import { createPaymentIntent, retrievePaymentIntent } from '@/apis/stripe'
import { toast } from 'react-toastify'

class StripeStore {
  clientSecret = null
  isLoading = false
  error = null

  constructor() {
    makeAutoObservable(this)
  }

  setClientSecret(secret) {
    this.clientSecret = secret
  }

  setLoading(status) {
    this.isLoading = status
  }

  setError(error) {
    this.error = error
  }

  async createPaymentIntent(amount) {
    this.setLoading(true)
    this.setError(null)

    try {
      const amountInCents = Math.round(amount * 100)
      const { clientSecret } = await createPaymentIntent(amountInCents)
      this.setClientSecret(clientSecret)
      return clientSecret
    } catch (error) {
      this.setError(error.message)
      toast.error('Failed to initialize payment. Please try again.')
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  async retrievePaymentIntent(paymentIntentId) {
    this.setLoading(true)
    this.setError(null)

    try {
      const paymentIntent = await retrievePaymentIntent(paymentIntentId)
      return paymentIntent
    } catch (error) {
      this.setError(error.message)
      toast.error('Failed to retrieve payment information.')
      throw error
    } finally {
      this.setLoading(false)
    }
  }

  reset() {
    this.clientSecret = null
    this.isLoading = false
    this.error = null
  }
}

export default StripeStore
