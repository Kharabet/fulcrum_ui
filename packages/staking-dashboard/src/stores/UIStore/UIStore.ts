import * as mobx from 'mobx'
import MediaQuery from './MediaQuery'
import bodyElementPlugin from './bodyElementPlugin'
import RootStore from '../RootStore'

export default class UIStore {
  public rootStore: RootStore
  public media = new MediaQuery()

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

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore
    bodyElementPlugin.register(this)
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
