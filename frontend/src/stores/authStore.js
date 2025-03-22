import { makeAutoObservable } from 'mobx'
import { login, register, updateProfile, getProfile } from '../apis/auth'

class AuthStore {
  user = null
  isAuthenticated = false
  isAdmin = false
  loading = true
  updateLoading = false

  constructor() {
    makeAutoObservable(this)
    this.initializeAuth()
  }

  initializeAuth = async () => {
    try {
      this.loading = true
      const token = localStorage.getItem('token') || sessionStorage.getItem('token')

      if (!token) {
        this.loading = false
        return
      }

      const { data } = await getProfile()
      if (data.success && data.user) {
        this.setUser(data.user)
      } else {
        this.logout()
      }
    } catch (error) {
      console.error('Initialize auth error:', error)
      this.logout()
    } finally {
      this.loading = false
    }
  }

  fetchUserProfile = async () => {
    try {
      const { data } = await getProfile()
      this.setUser(data.user)
    } catch (error) {
      this.logout()
    }
  }

  setUser = (user) => {
    this.user = user
    this.isAuthenticated = !!user
    this.isAdmin = user?.role === 'admin'
  }

  login = async (credentials) => {
    try {
      const { data } = await login(credentials)
      if (data.success && data.token) {
        if (credentials.rememberMe) {
          localStorage.setItem('token', data.token)
          sessionStorage.removeItem('token')
        } else {
          sessionStorage.setItem('token', data.token)
          localStorage.removeItem('token')
        }
        this.setUser(data.user)
        return true
      }
      return false
    } catch (error) {
      throw error
    }
  }

  register = async (credentials) => {
    this.loading = true
    try {
      const { data } = await register(credentials)
      return true
    } catch (error) {
      console.error('Register error:', error.response?.data)
      throw error
    } finally {
      this.loading = false
    }
  }

  logout = () => {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token')
    this.setUser(null)
    this.loading = false
  }

  updateProfile = async (userData) => {
    this.updateLoading = true
    try {
      const { data } = await updateProfile(userData)

      if (data.success) {
        this.setUser(data.user)
        return {
          success: true,
          message: data.message,
          isPasswordChanged: data.isPasswordChanged
        }
      }

      return {
        success: false,
        message: data.message
      }
    } catch (error) {
      console.error('Update profile error:', error)
      return {
        success: false,
        message: error.response?.data?.message || 'Error updating profile'
      }
    } finally {
      this.updateLoading = false
    }
  }
}

export default AuthStore
