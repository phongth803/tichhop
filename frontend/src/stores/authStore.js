import { makeAutoObservable } from 'mobx'
import axiosInstance from '../utils/axios'

class AuthStore {
  user = null
  isAuthenticated = false
  loading = false
  error = null

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  setUser = (user) => {
    this.user = user
    this.isAuthenticated = !!user
  }

  login = async (credentials) => {
    this.loading = true
    this.error = null
    try {
      const { data } = await axiosInstance.post('/auth/login', credentials)
      localStorage.setItem('token', data.token)
      this.setUser(data.user)
      return data
    } catch (error) {
      this.error = error.response?.data?.message || 'Login failed'
      throw error
    } finally {
      this.loading = false
    }
  }

  logout = () => {
    localStorage.removeItem('token')
    this.setUser(null)
  }
}

export default AuthStore
