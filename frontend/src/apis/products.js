import axiosInstance from '../utils/axios'

export const getProducts = async (params) => {
  try {
    const response = await axiosInstance.get('/products', { params })
    return response
  } catch (error) {
    throw error
  }
}

export const getBestSellingProducts = async () => {
  try {
    const response = await axiosInstance.get('/products/best-selling')
    return response
  } catch (error) {
    throw error
  }
}

export const getFlashSaleProducts = async () => {
  try {
    const response = await axiosInstance.get('/products/flash-sale')
    return response
  } catch (error) {
    throw error
  }
}
