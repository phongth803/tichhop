import axiosInstance from '../utils/axios'

export const createPaymentIntent = async (amount) => {
  try {
    const response = await axiosInstance.post('/stripe/create-payment-intent', { amount })
    return response.data
  } catch (error) {
    console.error('Error creating payment intent:', error)
    throw error
  }
}

export const retrievePaymentIntent = async (paymentIntentId) => {
  try {
    const response = await axiosInstance.get(`/stripe/payment-intent/${paymentIntentId}`)
    return response.data
  } catch (error) {
    console.error('Error retrieving payment intent:', error)
    throw error
  }
}
 