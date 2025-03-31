import axiosInstance from '../utils/axios'

export const getCategories = async (filter) => {
  try {
    const params = filter ? { ...filter } : {}
    const response = await axiosInstance.get('/categories', { params })
    return response
  } catch (error) {
    throw error
  }
}

export const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

export const addCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post('/categories', categoryData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData)
    return response.data
  } catch (error) {
    throw error
  }
}

export const deleteCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`, categoryData)
    return response.data
  } catch (error) {
    throw error
  }
}
