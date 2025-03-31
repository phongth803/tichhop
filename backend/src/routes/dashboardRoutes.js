import express from 'express'
import { auth, adminAuth } from '../middleware/auth.js'
import { getStats, getRevenue, getTopProducts, getCategoryDistribution } from '../controllers/dashboardController.js'

const router = express.Router()

/**
 * @swagger
 * /dashboard/stats:
 *   get:
 *     summary: Get dashboard statistics (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalSales:
 *                   type: number
 *                   description: Tổng doanh số (VND)
 *                 percentageChange:
 *                   type: number
 *                   description: % thay đổi doanh số
 *                 totalOrders:
 *                   type: number
 *                   description: Tổng số đơn hàng
 *                 orderPercentageChange:
 *                   type: number
 *                   description: % thay đổi số đơn hàng
 *                 totalCustomers:
 *                   type: number
 *                   description: Tổng số khách hàng mới
 *                 customerPercentageChange:
 *                   type: number
 *                   description: % thay đổi số khách hàng
 *                 averageOrderValue:
 *                   type: number
 *                   description: Giá trị đơn hàng trung bình
 *                 aovPercentageChange:
 *                   type: number
 *                   description: % thay đổi giá trị đơn trung bình
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.get('/stats', auth, adminAuth, getStats)

/**
 * @swagger
 * /dashboard/revenue:
 *   get:
 *     summary: Get monthly revenue data (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Monthly revenue data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   date:
 *                     type: string
 *                     description: Month in YYYY-MM format
 *                     example: "2024-03"
 *                   revenue:
 *                     type: number
 *                     description: Total revenue for the month
 *                     example: 15000000
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.get('/revenue', auth, adminAuth, getRevenue)

/**
 * @swagger
 * /dashboard/top-products:
 *   get:
 *     summary: Get top selling products (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top selling products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Product name
 *                     example: "iPhone 14 Pro"
 *                   sales:
 *                     type: number
 *                     description: Number of units sold
 *                     example: 25
 *                   revenue:
 *                     type: number
 *                     description: Total revenue from this product
 *                     example: 37500000
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.get('/top-products', auth, adminAuth, getTopProducts)

/**
 * @swagger
 * /dashboard/category-distribution:
 *   get:
 *     summary: Get category distribution (Admin only)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [revenue, products]
 *         description: Distribution type (revenue or products count)
 *         default: revenue
 *     responses:
 *       200:
 *         description: Category distribution retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     description: Category name
 *                     example: "Điện thoại"
 *                   value:
 *                     type: number
 *                     description: Revenue or product count for the category
 *                     example: 150000000
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Admin access required
 *       500:
 *         description: Server error
 */
router.get('/category-distribution', auth, adminAuth, getCategoryDistribution)

export default router
