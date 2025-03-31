import axiosInstance from '../utils/axios'

export const getStats = async (timeRange) => {
  try {
    const response = await axiosInstance.get('/dashboard/stats', {
      params: { timeRange }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getRevenue = async (timeRange) => {
  try {
    const response = await axiosInstance.get('/dashboard/revenue', {
      params: { timeRange }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getTopProducts = async (timeRange) => {
  try {
    const response = await axiosInstance.get('/dashboard/top-products', {
      params: { timeRange }
    })
    return response.data
  } catch (error) {
    throw error
  }
}

export const getCategoryDistribution = async (timeRange) => {
  try {
    const response = await axiosInstance.get('/dashboard/category-distribution', {
      params: { timeRange }
    })
    return response.data
  } catch (error) {
    throw error
  }
}