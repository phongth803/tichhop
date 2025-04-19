import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer from 'multer'
import dotenv from 'dotenv'
import path from 'path'

// Load .env file from the root backend directory
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
  throw new Error('Missing required Cloudinary environment variables')
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'ecommerce_v2',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
    transformation: [{ width: 500, height: 500, crop: 'limit' }]
  }
})

export const upload = multer({ storage: storage })
export default cloudinary
