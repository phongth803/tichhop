import Product from '../models/Product.js'
import Rating from '../models/Rating.js'

export const addRating = async (req, res) => {
  try {
    const { rating, review } = req.body
    const productId = req.params.id

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    // Find product
    const product = await Product.findById(productId)
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      })
    }

    // Check if user already rated
    const existingRating = await Rating.findOne({
      user: req.user.id,
      _id: { $in: product.ratings }
    })

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating
      existingRating.review = review
      existingRating.createdAt = Date.now()
      await existingRating.save()
    } else {
      // Create new rating
      const newRating = await Rating.create({
        user: req.user.id,
        rating,
        review
      })
      product.ratings.push(newRating._id)
    }

    // Calculate new average rating
    const allRatings = await Rating.find({ _id: { $in: product.ratings } })
    const totalRatings = allRatings.reduce((acc, item) => acc + item.rating, 0)
    product.averageRating = totalRatings / allRatings.length

    await product.save()

    res.status(200).json({
      success: true,
      data: product
    })
  } catch (error) {
    console.error('Error adding rating:', error)
    res.status(500).json({
      success: false,
      message: 'Error adding rating',
      error: error.message
    })
  }
}
