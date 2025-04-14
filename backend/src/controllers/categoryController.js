import ProductCategory from '../models/ProductCategory.js'

export const createCategory = async (req, res) => {
  try {
    const { name, description, status } = req.body
    const category = new ProductCategory({
      name,
      description,
      isActive: status
    })
    await category.save()
    res.status(201).json(category)
  } catch (error) {
    res.status(400).json({ message: 'Error creating category' })
  }
}

export const getCategories = async (req, res) => {
  try {
    const showAll = req.query.all === 'true'
    const filter = showAll ? {} : { isActive: true }
    const categories = await ProductCategory.find(filter).sort({ name: 1 })
    const { search, page = 1, limit = 10, all } = req.query
    const skip = (page - 1) * limit
    let query = {}

    if (all !== 'true') {
      query.isActive = true
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }

    const total = await ProductCategory.countDocuments(query)

    const categories = await ProductCategory.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))

    res.json({
      categories,
      totalItems: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit)
    })
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories' })
  }
}

export const getCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id)
    if (!category) {
      res.status(404).json({ message: 'Category not found' })
      return
    }
    res.json(category)
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category' })
  }
}

export const updateCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!category) {
      res.status(404).json({ message: 'Category not found' })
      return
    }
    res.json(category)
  } catch (error) {
    res.status(400).json({ message: 'Error updating category' })
  }
}

export const deleteCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findByIdAndDelete(req.params.id)
    if (!category) {
      res.status(404).json({ message: 'Category not found' })
      return
    }
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' })
  }
}
