import { makeAutoObservable } from 'mobx'
import { getUsers } from '../../apis/user'

class UserStore {
  loading = false

  constructor(rootStore) {
    this.rootStore = rootStore
    makeAutoObservable(this)
  }

  sendMessage = async (contactData) => {
    this.loading = true
    try {
      await sendContactMessage(contactData)
      return true
    } catch (error) {
      throw error
    } finally {
      this.loading = false
    }
  }
}

export default UserStore
