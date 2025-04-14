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

export const getProduct = async (id) => {
  try {
    const response = await axiosInstance.get(`/products/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

export const getRelatedProducts = async (productId, categoryId) => {
  return axiosInstance.get(`/products/${productId}/related/${categoryId}`)
}

export const addProduct = async (productData) => {
  try {
    const response = await axiosInstance.post('/products', productData)
    return response
  } catch (error) {
    throw error
  }
}

export const updateProduct = async (id, productData) => {
  try {
    const response = await axiosInstance.put(`/products/${id}`, productData)
    return response
  } catch (error) {
    throw error
  }
}

export const deleteProduct = async (id) => {
  try {
    const response = await axiosInstance.delete(`/products/${id}`)
    return response
  } catch (error) {
    throw error
  }
}

export const uploadProductImages = async (id, formData) => {
  try {
    const response = await axiosInstance.post(`/products/${id}/images`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response
  } catch (error) {
    throw error
  }
}

export const deleteProductImage = async (id, imageUrl) => {
  try {
    const encodedImageUrl = encodeURIComponent(imageUrl)
    const response = await axiosInstance.delete(`/products/${id}/images/${encodedImageUrl}`)
    return response
  } catch (error) {
    throw error
  }
}

export const addProductRating = async (productId, ratingData) => {
  try {
    const response = await axiosInstance.post(`/products/${productId}/ratings`, ratingData)
    return response
  } catch (error) {
    throw error
  }
}
