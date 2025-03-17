import { makeAutoObservable } from 'mobx'
import { login, register } from '../apis/auth'

class AuthStore {
  user = null
  isAuthenticated = false
  loading = false

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
    try {
      const { data } = await login(credentials)
      data.token && localStorage.setItem('token', data.token)
      this.setUser(data.user)
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }

  register = async (credentials) => {
    this.loading = true
    try {
      await register(credentials)
      return true
    } catch (error) {
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
