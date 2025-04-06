import { makeAutoObservable } from 'mobx'
import { getUsers, getUserById, updateUser, deleteUser, addUser } from '../../apis/user'

class UserStore {
  loading = false
  isListLoading = false
  userList = []
  pagination = {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  }

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  getUsers = async (page = 1, limit = 10, search = '', filters = {}) => {
    this.isListLoading = true
    try {
      const response = await getUsers({
        page,
        limit,
        search,
        role: filters.role || '',
        isActive: filters.status
      })
      this.userList = response.users || []
      this.pagination = {
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        totalItems: response.totalItems,
        itemsPerPage: limit
      }
      return true
    } catch (error) {
      throw error
    } finally {
      this.isListLoading = false
    }
  }

  addUser = async (userData) => {
    this.loading = true
    try {
      await addUser(userData)
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }

  deleteUser = async (id) => {
    this.loading = true
    try {
      await deleteUser(id)
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }

  updateUser = async (id, userData) => {
    this.loading = true
    try {
      await updateUser(id, userData)
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }
}

export default UserStore
