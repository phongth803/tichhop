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
      product: productId,
      _id: { $in: product.ratings }
    })

    let savedRating

    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating
      existingRating.review = review
      existingRating.updatedAt = Date.now()
      savedRating = await existingRating.save()
    } else {
      // Create new rating
      const newRating = await Rating.create({
        user: req.user.id,
        product: productId,
        rating,
        review
      })
      product.ratings.push(newRating._id)
      savedRating = newRating
    }

    // Calculate new average rating
    const allRatings = await Rating.find({ _id: { $in: product.ratings } })
    const totalRatings = allRatings.reduce((acc, item) => acc + item.rating, 0)
    product.averageRating = totalRatings / allRatings.length

    await product.save()

    // Populate the rating with product details before sending response
    const populatedRating = await Rating.findById(savedRating._id).populate(
      'product',
      'name images thumbnail price description'
    )

    res.status(200).json({
      success: true,
      data: populatedRating
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

// Get all ratings for current user
export const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ user: req.user.id })
      .populate('product', 'name thumbnail')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      data: ratings
    })
  } catch (error) {
    console.error('Error fetching user ratings:', error)
    res.status(500).json({
      success: false,
      message: 'Error fetching user ratings',
      error: error.message
    })
  }
}

// Update a specific rating
export const updateRating = async (req, res) => {
  try {
    const { rating, review } = req.body
    const ratingId = req.params.id

    // Validate rating value
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      })
    }

    // Find and update rating
    const updatedRating = await Rating.findOneAndUpdate(
      { _id: ratingId, user: req.user.id },
      { rating, review, updatedAt: Date.now() },
      { new: true }
    )

    if (!updatedRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found or unauthorized'
      })
    }

    // Update product's average rating
    const product = await Product.findOne({ ratings: ratingId })
    if (product) {
      const allRatings = await Rating.find({ _id: { $in: product.ratings } })
      const totalRatings = allRatings.reduce((acc, item) => acc + item.rating, 0)
      product.averageRating = totalRatings / allRatings.length
      await product.save()
    }

    res.status(200).json({
      success: true,
      data: updatedRating
    })
  } catch (error) {
    console.error('Error updating rating:', error)
    res.status(500).json({
      success: false,
      message: 'Error updating rating',
      error: error.message
    })
  }
}

// Delete a rating
export const deleteRating = async (req, res) => {
  try {
    const ratingId = req.params.id

    // Find and delete rating
    const deletedRating = await Rating.findOneAndDelete({
      _id: ratingId,
      user: req.user.id
    })

    if (!deletedRating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found or unauthorized'
      })
    }

    // Update product's ratings array and average rating
    const product = await Product.findOne({ ratings: ratingId })
    if (product) {
      product.ratings = product.ratings.filter(id => id.toString() !== ratingId)

      if (product.ratings.length > 0) {
        const allRatings = await Rating.find({ _id: { $in: product.ratings } })
        const totalRatings = allRatings.reduce((acc, item) => acc + item.rating, 0)
        product.averageRating = totalRatings / allRatings.length
      } else {
        product.averageRating = 0
      }

      await product.save()
    }

    res.status(200).json({
      success: true,
      message: 'Rating deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting rating:', error)
    res.status(500).json({
      success: false,
      message: 'Error deleting rating',
      error: error.message
    })
  }
}
