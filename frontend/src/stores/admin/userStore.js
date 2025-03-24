import { makeAutoObservable } from 'mobx'
import { getUsers, getUserById, updateUser, deleteUser } from '../../apis/user'

class UserStore {
  loading = false
  userList = []

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  getUsers = async () => {
    this.loading = true
    try {
      const users = await getUsers()
      this.userList = users
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }
}

export default UserStore
