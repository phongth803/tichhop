import ProductCategory from '../models/ProductCategory.js'

export const createCategory = async (req, res) => {
  try {
    const category = new ProductCategory(req.body)
    await category.save()
    res.status(201).json(category)
  } catch (error) {
    res.status(400).json({ message: 'Error creating category' })
  }
}

export const getCategories = async (req, res) => {
  try {
    const categories = await ProductCategory.find({ isActive: true })
    res.json(categories)
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
    const category = await ProductCategory.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true })
    if (!category) {
      res.status(404).json({ message: 'Category not found' })
      return
    }
    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category' })
  }
}
