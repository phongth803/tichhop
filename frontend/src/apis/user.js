import axiosInstance from "../utils/axios"

export const getUsers = async (params) => {
  try {
    const response = await axiosInstance.get('/admin/users', { params })
    return response.data
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

export const getUserById = async (id) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching user by id:', error)
    throw error
  }
}

export const addUser = async (userData) => {
  try {
    const response = await axiosInstance.post('/admin/users', userData)
    return response.data
  } catch (error) {
    console.error('Error adding user:', error)
    throw error
  }
}

export const updateUser = async (id, userData) => {
  try {
    const response = await axiosInstance.patch(`/admin/users/${id}`, userData)
    return response.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await axiosInstance.delete(`/admin/users/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
