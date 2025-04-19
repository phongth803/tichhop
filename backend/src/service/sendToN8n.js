import axios from 'axios'
import dotenv from 'dotenv'

dotenv.config()

const sendToN8n = async (type, data) => {
  try {
    const body = {
      type: type,
      data: data
    }
    console.log('Webhook URL:', process.env.N8N_WEBHOOK_URL)
    const response = await axios.post(process.env.N8N_WEBHOOK_URL, body)
    return response.data
  } catch (error) {
    console.error('Error sending to N8N:', error.message)
    throw error
  }
}

export default sendToN8n
