import axiosInstance from '@/utils/axios'

export const login = (credentials) => axiosInstance.post('/auth/login', credentials)
export const register = (userData) => axiosInstance.post('/auth/register', userData)
export const getProfile = () => axiosInstance.get('/auth/me')
export const updateProfile = (userData) => axiosInstance.put('/auth/update-profile', userData)

export const changePassword = async (passwordData) => {
  try {
    const response = await axiosInstance.put('/auth/change-password', passwordData)
    return response
  } catch (error) {
    throw error
  }
}
