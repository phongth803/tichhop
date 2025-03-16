import Product from '../models/Product.js'
import cloudinary from '../config/cloudinary.js'

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body

    // Tạo sản phẩm mới với thông tin cơ bản
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      images: [] // Khởi tạo mảng ảnh rỗng
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
    const { category, search } = req.query
    let query = { isActive: true }

    if (category) {
      query.category = category
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' }
    }

    const products = await Product.find(query).populate('category', 'name').sort({ createdAt: -1 })
    res.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ message: 'Error fetching products', error: error.message })
  }
}

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name')
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    res.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    res.status(500).json({ message: 'Error fetching product', error: error.message })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, isActive } = req.body

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
