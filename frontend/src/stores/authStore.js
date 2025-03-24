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
    // Chỉ lấy token từ localStorage, vì sessionStorage sẽ tự động xóa khi đóng tab
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    if (token) {
      this.initializeAuth()
    } else {
      this.loading = false
    }
  }

  initializeAuth = async () => {
    try {
      const response = await getProfile()
      if (response.data.success) {
        this.setUser(response.data.user)
      } else {
        this.logout()
      }
    } catch (error) {
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
    this.isAuthenticated = user !== null
    this.isAdmin = user?.role === 'admin'
  }

  login = async (userData) => {
    try {
      const { data } = await login(userData)
      if (data.success) {
        // Lưu token vào đúng storage dựa trên rememberMe
        const storage = userData.rememberMe ? localStorage : sessionStorage
        const isAdmin = data.user.role === 'admin'
        storage.setItem('token', data.token)

        // Đảm bảo xóa token ở storage còn lại
        if (userData.rememberMe) {
          sessionStorage.removeItem('token')
        } else {
          localStorage.removeItem('token')
        }
        this.isAdmin = isAdmin
        this.setUser(data.user)
        return { success: true, isAdmin: isAdmin }
      }
      return { success: false }
    } catch (error) {
      throw error
    }
  }

  register = async (userData) => {
    try {
      const { data } = await register(userData)
      if (data.success) {
        // Luôn lưu vào localStorage (remember me) khi đăng ký
        localStorage.setItem('token', data.token)
        // Xóa token trong sessionStorage nếu có
        sessionStorage.removeItem('token')

        this.setUser(data.user)
        return {
          success: true
        }
      }
      return {
        success: false,
        message: data.message
      }
    } catch (error) {
      console.error('Register error:', error)
      throw error
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
