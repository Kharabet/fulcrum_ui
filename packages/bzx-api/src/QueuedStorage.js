import localdb from 'node-persist'
import when from 'when'

class QueuedStorage {
  constructor() {
    this.storage = localdb.create({ ttl: true, logging: false })
  }

  async init() {
    await this.storage.init({ dir: 'persist-storage' })
  }

  async getItem(key) {
    this.current = when(
      this.current,
      () => {
        return this.storage.getItem(key)
      },
      () => {
        return this.storage.getItem(key)
      }
    )
    return this.current
  }

  async setItem(key, value) {
    this.current = when(
      this.current,
      () => {
        return this.storage.setItem(key, value)
      },
      () => {
        return this.storage.setItem(key, value)
      }
    )
    return this.current
  }
}

export default QueuedStorage
