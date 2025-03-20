import { makeAutoObservable } from 'mobx'
import { sendContactMessage } from '../apis/contact'

class ContactStore {
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

export default ContactStore
