import express from 'express'
import { auth, adminAuth } from '../middleware/auth.js'
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  uploadImages,
  deleteImage,
  getBestSellingProducts,
  getFlashSaleProducts
} from '../controllers/productController.js'
import { upload } from '../config/cloudinary.js'

const router = express.Router()

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - category
 *       properties:
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         price:
 *           type: number
 *         category:
 *           type: string
 *         stock:
 *           type: number
 *         images:
 *           type: array
 *           items:
 *             type: string
 *         isActive:
 *           type: boolean
 *           default: true
 *         discount:
 *           type: number
 *           default: 0
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category ID
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by product name
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Create a new product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 * 
 * /products/best-selling:
 *   get:
 *     summary: Get best-selling products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of best-selling products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 * 
 * /products/flash-sale:
 *   get:
 *     summary: Get flash sale products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of flash sale products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *
 * /products/{id}:
 *   get:
 *     summary: Get product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *   put:
 *     summary: Update product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 *   delete:
 *     summary: Delete product (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Product not found
 *
 * /products/{id}/images:
 *   post:
 *     summary: Upload product images (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *
 * /products/{id}/images/{imageUrl}:
 *   delete:
 *     summary: Delete product image (Admin only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *       - in: path
 *         name: imageUrl
 *         required: true
 *         schema:
 *           type: string
 *         description: Image filename from Cloudinary URL (e.g., 'example.jpg')
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       404:
 *         description: Image not found
 */

// Routes
router.get('/', getProducts)
router.get('/best-selling', getBestSellingProducts)
router.get('/flash-sale', getFlashSaleProducts)
router.get('/:id', getProduct)
router.post('/', auth, adminAuth, createProduct)
router.put('/:id', auth, adminAuth, updateProduct)
router.delete('/:id', auth, adminAuth, deleteProduct)
router.post('/:id/images', auth, adminAuth, upload.array('images', 5), uploadImages)
router.delete('/:id/images/:imageUrl', auth, adminAuth, deleteImage)

export default router
