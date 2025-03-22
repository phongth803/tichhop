import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const clearDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    const collections = await mongoose.connection.db.collections()

    for (let collection of collections) {
      await collection.drop()
    }

    console.log('All collections dropped successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error dropping collections:', error)
    process.exit(1)
  }
}

clearDatabase()
