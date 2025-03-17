import axiosInstance from '../../utils/axios'

export const login = async (credentials) => {
  try {
    const response = await axiosInstance.post('/auth/login', credentials)
    return response
  } catch (error) {
    throw error
  }
}

export const register = async (userData) => {
  try {
    const response = await axiosInstance.post('/auth/register', userData)
    return response
  } catch (error) {
    throw error
  }
}
