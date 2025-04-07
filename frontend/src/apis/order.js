import axiosInstance from "../utils/axios"

export const getAllOrders = async () => {
  try {
    const response = await axiosInstance.get('/orders/all')
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
