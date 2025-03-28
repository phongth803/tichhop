import { makeAutoObservable } from 'mobx'
import { getUsers, getUserById, updateUser, deleteUser, addUser } from '../../apis/user'

class UserStore {
  loading = false
  isListLoading = false
  userList = []

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  getUsers = async () => {
    this.isListLoading = true
    try {
      const users = await getUsers()
      this.userList = users || []
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
