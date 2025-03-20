import axiosInstance from '../utils/axios'

export const sendContactMessage = async (contactData) => {
  return await axiosInstance.post('/contact', contactData)
}
