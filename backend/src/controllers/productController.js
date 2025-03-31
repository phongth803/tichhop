import Product from '../models/Product.js'
import cloudinary from '../config/cloudinary.js'
import Order from '../models/Order.js'

// Helper function để transform product
export const transformProduct = product => {
  const productObj = product.toObject()
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  return {
    ...productObj,
    priceOnSale: product.price * (1 - (product.discount || 0) / 100),
    isNew: product.createdAt > sevenDaysAgo
  }
}

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, discount } = req.body

    // Tạo sản phẩm mới với thông tin cơ bản
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images: [], // Khởi tạo mảng ảnh rỗng
      discount: discount || 0
    })

    // Nếu có files được upload
    if (req.files && req.files.length > 0) {
      const imageUrls = req.files.map(file => file.path)
      product.images = imageUrls
      // Không cần set thumbnail thủ công, middleware sẽ tự xử lý
    }

    await product.save()
    await product.populate('category', 'name')
    res.status(201).json(product)
  } catch (error) {
    console.error('Error creating product:', error)
    res.status(400).json({ message: 'Error creating product', error: error.message })
  }
}

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 20

    const buildQuery = () => {
      const query = { isActive: true }

      if (req.query.category) {
        query.category = req.query.category
      }

      if (req.query.search) {
        query.name = { $regex: req.query.search, $options: 'i' }
      }

      if (req.query.onSale === 'true') {
        query.discount = { $gt: 0 }
      }

      if (req.query.minPrice || req.query.maxPrice) {
        query.price = {}
        if (req.query.minPrice) {
          query.price.$gte = parseFloat(req.query.minPrice)
        }
        if (req.query.maxPrice) {
          query.price.$lte = parseFloat(req.query.maxPrice)
        }
      }

      return query
    }

    const buildSortOptions = () => {
      switch (req.query.sort) {
        case 'price-asc':
          return { price: 1 }
        case 'price-desc':
          return { price: -1 }
        default:
          return { createdAt: -1 }
      }
    }

    // Thực hiện queries song song
    const [total, products] = await Promise.all([
      Product.countDocuments(buildQuery()),
      Product.find(buildQuery())
        .populate('category', 'name')
        .sort(buildSortOptions())
        .skip((page - 1) * limit)
        .limit(limit)
    ])

    res.json({
      products: products.map(transformProduct),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({
      message: 'Error fetching products',
      error: error.message
    })
  }
}

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name')

    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    res.json(transformProduct(product))
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ message: 'Error fetching product', error: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isActive, discount } = req.body

    // Tìm sản phẩm hiện tại
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    // Cập nhật thông tin cơ bản
    product.name = name || product.name
    product.description = description || product.description
    product.price = price || product.price
    product.category = category || product.category
    product.stock = stock !== undefined ? stock : product.stock
    product.isActive = isActive !== undefined ? isActive : product.isActive
    product.discount = discount || product.discount

    await product.save()
    res.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    res.status(400).json({ message: 'Error updating product', error: error.message })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!product) {
      res.status(404).json({ message: 'Product not found' })
      return
    }
    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product' })
  }
}

export const uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' })
    }

    const product = await Product.findById(req.params.id)
    if (!product) {
      // Xóa ảnh đã upload nếu không tìm thấy sản phẩm
      for (const file of req.files) {
        const publicId = file.path.split('/').pop().split('.')[0]
        await cloudinary.uploader.destroy(publicId)
      }
      return res.status(404).json({ message: 'Product not found' })
    }

    const imageUrls = req.files.map(file => file.path)

    // Thêm ảnh mới vào mảng images
    product.images.push(...imageUrls)
    // Không cần set thumbnail thủ công, middleware sẽ tự xử lý

    await product.save()
    res.json(product)
  } catch (error) {
    console.error('Error uploading images:', error)
    res.status(400).json({ message: 'Error uploading images', error: error.message })
  }
}

export const deleteImage = async (req, res) => {
  try {
    const { id, imageUrl } = req.params

    const product = await Product.findById(id)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }

    if (!product.images.includes(imageUrl)) {
      return res.status(404).json({ message: 'Image not found' })
    }

    // Xóa ảnh từ Cloudinary
    const publicId = `ecommerce/${imageUrl.split('/').pop().split('.')[0]}`
    await cloudinary.uploader.destroy(publicId)

    // Xóa URL ảnh khỏi mảng images
    product.images = product.images.filter(img => img !== imageUrl)

    // Nếu ảnh bị xóa là thumbnail, set thumbnail mới
    if (product.thumbnail === imageUrl) {
      product.thumbnail = product.images.length > 0 ? product.images[0] : null
    }

    await product.save()
    res.json(product)
  } catch (error) {
    console.error('Error deleting image:', error)
    res.status(400).json({ message: 'Error deleting image', error: error.message })
  }
}

export const getBestSellingProducts = async (req, res) => {
  try {
    // Lấy top sản phẩm bán chạy
    const bestSellers = await Order.aggregate([
      { $match: { status: 'delivered' } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 4 }
    ])

    // Lấy thông tin sản phẩm
    const products = await Product.find({
      _id: { $in: bestSellers.map(item => item._id) }
    }).populate('category', 'name')

    // Transform và thêm totalSold
    const transformedProducts = products.map(product => ({
      ...transformProduct(product),
      totalSold: bestSellers.find(item => item._id.toString() === product._id.toString())?.totalSold || 0
    }))

    // Sắp xếp lại theo số lượng bán
    transformedProducts.sort((a, b) => b.totalSold - a.totalSold)
    res.json(transformedProducts)
  } catch (error) {
    console.error('Error fetching best selling products:', error)
    res.status(500).json({ message: 'Error fetching best selling products' })
  }
}

export const getFlashSaleProducts = async (req, res) => {
  try {
    const products = await Product.find({ discount: { $gt: 0 } })
      .populate('category', 'name')
      .sort({ discount: -1 })

    res.json(products.map(transformProduct))
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Error fetching products', error: error.message })
  }
}

export const getRelatedProducts = async (req, res) => {
  try {
    const { id, categoryId, limit = 4 } = req.params

    const products = await Product.find({
      category: categoryId,
      _id: { $ne: id },
      isActive: true
    })
      .populate('category', 'name')
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })

    res.json(products.map(transformProduct))
  } catch (error) {
    console.error('Error fetching related products:', error)
    res.status(500).json({ message: 'Error fetching related products', error: error.message })
  }
}
