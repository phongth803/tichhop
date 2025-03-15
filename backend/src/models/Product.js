import mongoose from 'mongoose'

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
    ratings: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        rating: {
          type: Number,
          min: 1,
          max: 5
        },
        review: String,
        createdAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    averageRating: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
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

export default mongoose.model('Product', productSchema)
