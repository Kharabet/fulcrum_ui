import { Web3Wrapper } from '@0x/web3-wrapper'
import { BorrowRequestAwaiting } from '../domain/BorrowRequestAwaiting'

export class BorrowRequestAwaitingStore {
  private readonly _networkId: number
  private readonly _web3Wrapper: Web3Wrapper
  private _items: BorrowRequestAwaiting[]

  constructor(networkId: number, web3Wrapper: Web3Wrapper) {
    this._networkId = networkId
    this._web3Wrapper = web3Wrapper
    this._items = []

    this._loadData()
  }

  public async add(request: BorrowRequestAwaiting) {
    if (request.networkId !== this._networkId) {
      return
    }

    let isInListAlready = false
    for (const item of this._items) {
      if (request.equals(item)) {
        isInListAlready = true
        break
      }
    }

    if (!isInListAlready) {
      this._items.unshift(request)
    }

    this._storeData()
  }

  public async remove(request: BorrowRequestAwaiting) {
    if (request.networkId !== this._networkId) {
      return
    }

    for (let i = this._items.length - 1; i >= 0; i--) {
      if (this._items[i].equals(request)) {
        this._items.splice(i, 1)
      }
    }

    this._storeData()
  }

  public async cleanUp(address: string) {
    const itemsCleaned = Array<BorrowRequestAwaiting>()
    for (const item of this._items) {
      if (item.networkId !== this._networkId) {
        itemsCleaned.push(item)

        continue
      }

      if (item.walletAddress !== address) {
        itemsCleaned.push(item)

        continue
      }

      const tx = await this._web3Wrapper.getTransactionReceiptIfExistsAsync(item.txHash)
      if (tx === undefined) {
        itemsCleaned.push(item)
      }
    }
    this._items = itemsCleaned

    this._storeData()
  }

  public async list(address: string): Promise<ReadonlyArray<BorrowRequestAwaiting>> {
    return this._items.filter((e) => e.walletAddress === address)
  }

  private _loadData() {
    const storageKey = this._getLocalStoreKey()
    const storageItem = JSON.parse(localStorage.getItem(storageKey) || '[]')
    if (storageItem) {
      if (Array.isArray(storageItem)) {
        this._items = (storageItem as any).map((e: any) => BorrowRequestAwaiting.fromObj(e))
      }
    }
  }

  private _storeData() {
    const storageKey = this._getLocalStoreKey()
    localStorage.setItem(
      storageKey,
      JSON.stringify(this._items.map((e) => BorrowRequestAwaiting.toObj(e)))
    )
  }

  private _getLocalStoreKey() {
    return `bras_${this._networkId}`
  }
}
