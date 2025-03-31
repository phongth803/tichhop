import Order from '../models/Order.js'
import User from '../models/User.js'

export const getStats = async (req, res) => {
  try {
    const today = new Date()
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
    const sixtyDaysAgo = new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000)

    // Lấy dữ liệu cho 30 ngày gần đây
    const [currentPeriodStats, previousPeriodStats] = await Promise.all([
      // Thống kê 30 ngày gần đây
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
            status: { $in: ['delivered', 'completed'] }
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalAmount' },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: '$totalAmount' }
          }
        }
      ]),
      // Thống kê 30 ngày trước đó để so sánh
      Order.aggregate([
        {
          $match: {
            createdAt: {
              $gte: sixtyDaysAgo,
              $lt: thirtyDaysAgo
            },
            status: { $in: ['delivered', 'completed'] }
          }
        },
        {
          $group: {
            _id: null,
            totalSales: { $sum: '$totalAmount' },
            totalOrders: { $sum: 1 },
            averageOrderValue: { $avg: '$totalAmount' }
          }
        }
      ])
    ])

    // Lấy số lượng khách hàng
    const [currentCustomers, previousCustomers] = await Promise.all([
      User.countDocuments({
        role: 'user',
        createdAt: { $gte: thirtyDaysAgo }
      }),
      User.countDocuments({
        role: 'user',
        createdAt: {
          $gte: sixtyDaysAgo,
          $lt: thirtyDaysAgo
        }
      })
    ])

    // Tính toán các chỉ số
    const current = currentPeriodStats[0] || { totalSales: 0, totalOrders: 0, averageOrderValue: 0 }
    const previous = previousPeriodStats[0] || { totalSales: 0, totalOrders: 0, averageOrderValue: 0 }

    // Hàm tính phần trăm thay đổi
    const calculatePercentageChange = (current, previous) => {
      if (previous === 0) return current > 0 ? 100 : 0
      return ((current - previous) / previous) * 100
    }

    const stats = {
      totalSales: current.totalSales,
      percentageChange: calculatePercentageChange(current.totalSales, previous.totalSales),
      totalOrders: current.totalOrders,
      orderPercentageChange: calculatePercentageChange(current.totalOrders, previous.totalOrders),
      totalCustomers: currentCustomers,
      customerPercentageChange: calculatePercentageChange(currentCustomers, previousCustomers),
      averageOrderValue: current.averageOrderValue || 0,
      aovPercentageChange: calculatePercentageChange(current.averageOrderValue || 0, previous.averageOrderValue || 0)
    }

    res.json(stats)
  } catch (error) {
    console.error('Error getting dashboard stats:', error)
    res.status(500).json({ message: 'Error getting dashboard stats' })
  }
}

export const getRevenue = async (req, res) => {
  try {
    // Lấy dữ liệu doanh thu 12 tháng gần nhất
    const twelveMonthsAgo = new Date()
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
    twelveMonthsAgo.setDate(1)
    twelveMonthsAgo.setHours(0, 0, 0, 0)

    const revenueData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: twelveMonthsAgo },
          status: { $in: ['delivered', 'completed'] }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' }
        }
      },
      {
        $project: {
          _id: 0,
          date: {
            $concat: [
              { $toString: '$_id.year' },
              '-',
              {
                $cond: {
                  if: { $lt: ['$_id.month', 10] },
                  then: { $concat: ['0', { $toString: '$_id.month' }] },
                  else: { $toString: '$_id.month' }
                }
              }
            ]
          },
          revenue: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ])

    // Đảm bảo có đủ dữ liệu cho 12 tháng
    const result = []
    const today = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthData = revenueData.find(item => item.date === monthStr)
      result.push({
        date: monthStr,
        revenue: monthData ? monthData.revenue : 0
      })
    }

    res.json(result)
  } catch (error) {
    console.error('Error getting revenue data:', error)
    res.status(500).json({ message: 'Error getting revenue data' })
  }
}

export const getTopProducts = async (req, res) => {
  try {
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: { $in: ['delivered', 'completed'] }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      { $unwind: '$productInfo' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$productInfo.name' },
          sales: { $sum: '$items.quantity' },
          revenue: {
            $sum: { $multiply: ['$items.price', '$items.quantity'] }
          }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: 0,
          name: 1,
          sales: 1,
          revenue: 1
        }
      }
    ])

    res.json(topProducts)
  } catch (error) {
    console.error('Error getting top products:', error)
    res.status(500).json({ message: 'Error getting top products' })
  }
}

export const getCategoryDistribution = async (req, res) => {
  try {
    const { type = 'revenue' } = req.query
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    if (type === 'revenue') {
      // Phân bố theo doanh thu
      const distribution = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
            status: { $in: ['delivered', 'completed'] }
          }
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product.category',
            value: {
              $sum: { $multiply: ['$items.price', '$items.quantity'] }
            }
          }
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: 1
          }
        },
        { $sort: { value: -1 } }
      ])

      res.json(distribution)
    } else {
      // Phân bố theo số lượng sản phẩm đã bán
      const distribution = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
            status: { $in: ['delivered', 'completed'] }
          }
        },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'product'
          }
        },
        { $unwind: '$product' },
        {
          $group: {
            _id: '$product.category',
            value: { $sum: '$items.quantity' }
          }
        },
        {
          $project: {
            _id: 0,
            name: '$_id',
            value: 1
          }
        },
        { $sort: { value: -1 } }
      ])

      res.json(distribution)
    }
  } catch (error) {
    console.error('Error getting category distribution:', error)
    res.status(500).json({ message: 'Error getting category distribution' })
  }
}
