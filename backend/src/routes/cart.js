import express from 'express'
import { auth, adminAuth } from '../middleware/auth.js'
import { getCart, addToCart, updateCartItem, removeFromCart, getAllCarts } from '../controllers/cartController.js'

const router = express.Router()

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get user's cart (User only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart retrieved successfully
 *       401:
 *         description: Unauthorized
 *
 * /cart/add:
 *   post:
 *     summary: Add item to cart (User only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Invalid input or insufficient stock
 *       401:
 *         description: Unauthorized
 *
 * /cart/update:
 *   put:
 *     summary: Update cart item quantity (User only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: number
 *                 minimum: 1
 *     responses:
 *       200:
 *         description: Cart item updated successfully
 *       401:
 *         description: Unauthorized
 *
 * /cart/{productId}:
 *   delete:
 *     summary: Remove item from cart (User only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed from cart successfully
 *       401:
 *         description: Unauthorized
 *
 * /cart/all:
 *   get:
 *     summary: Get all users' carts (Admin only)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all carts
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 */

router.get('/', auth, getCart)
router.post('/add', auth, addToCart)
router.put('/update', auth, updateCartItem)
router.delete('/:productId', auth, removeFromCart)
router.get('/all', auth, adminAuth, getAllCarts)

export default router
