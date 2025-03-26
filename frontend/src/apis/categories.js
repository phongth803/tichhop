import axiosInstance from '../utils/axios'

export const getCategories = async () => {
  try {
    const response = await axiosInstance.get('/categories')
    return response
  } catch (error) {
    throw error
  }
}
