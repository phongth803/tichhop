import axiosInstance from '../utils/axios'

export const getCart = async () => {
  try {
    const response = await axiosInstance.get('/cart')
    return response
  } catch (error) {
    throw error
  }
}

export const addToCart = async (productId, quantity) => {
  try {
    const response = await axiosInstance.post('/cart/add', { productId, quantity })
    return response
  } catch (error) {
    throw error
  }
}

export const updateCartItem = async (productId, quantity) => {
  try {
    const response = await axiosInstance.put('/cart/update', { productId, quantity })
    return response
  } catch (error) {
    throw error
  }
}

export const removeFromCart = async (productId) => {
  try {
    const response = await axiosInstance.delete(`/cart/${productId}`)
    return response
  } catch (error) {
    throw error
  }
}
