import * as mobx from 'mobx'
import MediaQuery from './MediaQuery'
import bodyElementPlugin from './bodyElementPlugin'
import RootStore from '../RootStore'
import { DialogVM } from 'ui-framework'

export default class UIStore {
  public rootStore: RootStore
  public media = new MediaQuery()
  public walletUpdatePopup = new DialogVM({transitionDelay: 200})

  public static colors = {
    light: {
      // TODO
    },
    dark: {
      // TODO
    }
  }

  get theme(): 'dark' | 'light' {
    // TODO, get it from settings in the future
    return 'light'
  }

  get colors() {
    return UIStore.colors[this.theme]
  }

  private init() {
    mobx.reaction(
      () => this.rootStore.stakingStore.walletUpdate,
      (walletUpdate) => {
        if (walletUpdate) {
          this.walletUpdatePopup.show()
          setTimeout(() => {
            walletUpdate.switchAmounts()
            setTimeout(() => {
              this.walletUpdatePopup.hide()
            }, 2000)
          }, 2000)
        }
      }
    )
  }

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    bodyElementPlugin.register(this)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
    this.init()
  }
}
