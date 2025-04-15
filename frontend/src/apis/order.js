import axiosInstance from '../utils/axios'

export const getAllOrders = async (params) => {
  try {
    const response = await axiosInstance.get('/orders/all', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching all orders:', error)
    throw error
  }
}

export const updateOrderStatus = async (id, statusData) => {
  try {
    const response = await axiosInstance.put(`/orders/${id}/status`, statusData)
    return response.data
  } catch (error) {
    console.error('Error updating order status:', error)
    throw error
  }
}

export const getUserOrders = async (params) => {
  try {
    const response = await axiosInstance.get('/orders/my-orders', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching user orders:', error)
    throw error
  }
}

export const createOrder = async (orderData) => {
  try {
    const response = await axiosInstance.post('/orders', orderData)
    return response.data
  } catch (error) {
    console.error('Error creating order:', error)
    throw error
  }
}
