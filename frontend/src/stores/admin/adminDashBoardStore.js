import { makeAutoObservable } from 'mobx'
import { getStats, getRevenue, getTopProducts, getCategoryDistribution } from '../../apis/dashBoard'

class DashboardStore {
  loading = false
  error = null
  stats = null
  revenueData = []
  topProducts = []
  categoryDistribution = []

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  setLoading = (status) => {
    this.loading = status
  }

  setError = (error) => {
    this.error = error
  }

  setStats = (stats) => {
    this.stats = stats
  }

  setRevenueData = (data) => {
    this.revenueData = data
  }

  setTopProducts = (products) => {
    this.topProducts = products
  }

  setCategoryDistribution = (distribution) => {
    this.categoryDistribution = distribution
  }

  fetchDashboardData = async (timeRange) => {
    this.setLoading(true)
    this.setError(null)
    try {
      const [stats, revenue, products, categories] = await Promise.all([
        getStats(timeRange),
        getRevenue(timeRange),
        getTopProducts(timeRange),
        getCategoryDistribution(timeRange)
      ])

      this.setStats(stats)
      this.setRevenueData(revenue)
      this.setTopProducts(products)
      this.setCategoryDistribution(categories)
      return true
    } catch (error) {
      this.setError(error.message)
      throw error
    } finally {
      this.setLoading(false)
    }
  }
}

export default DashboardStore