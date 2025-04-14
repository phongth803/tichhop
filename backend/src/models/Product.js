import mongoose from 'mongoose'
import Rating from './Rating.js'

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCategory',
      required: true
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0
    },
    images: [
      {
        type: String,
        validate: {
          validator: function (v) {
            return /^https?:\/\/.*\.(png|jpg|jpeg|gif)$/i.test(v)
          },
          message: props => `${props.value} is not a valid image URL!`
        }
      }
    ],
    thumbnail: {
      type: String,
      validate: {
        validator: function (v) {
          if (!v) return true // Allow null/undefined
          return /^https?:\/\/.*\.(png|jpg|jpeg|gif)$/i.test(v)
        },
        message: props => `${props.value} is not a valid image URL!`
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    discount: {
      type: Number,
      default: 0
    },
    ratings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Rating'
      }
    ],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

// Middleware để tự động set thumbnail và tính rating
productSchema.pre('save', function (next) {
  if (this.images && this.images.length > 0 && !this.thumbnail) {
    this.thumbnail = this.images[0]
  }

  if (this.ratings && this.ratings.length > 0) {
    const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0)
    this.averageRating = sum / this.ratings.length
  }

  next()
})

const Product = mongoose.model('Product', productSchema)

export default Product
