import axiosInstance from '@/utils/axios'

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

export const getProfile = async () => {
  try {
    const response = await axiosInstance.get('/auth/me')
    return response
  } catch (error) {
    throw error
  }
}

export const updateProfile = async (userData) => {
  try {
    const response = await axiosInstance.put('/auth/update-profile', userData)
    return response
  } catch (error) {
    throw error
  }
}

export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.put('/auth/change-password', passwordData)
    return response
  } catch (error) {
    throw error
  }
}
