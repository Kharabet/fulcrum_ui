import * as mobx from 'mobx'
import { RootStore } from 'src/stores'
import { DialogVM } from 'ui-framework'

type AppVMProps = 'pending'

export default class AppVM {
  [name: string]: any
  public rootStore: RootStore
  public pending = false
  public headerMenu = new DialogVM()
  public providerMenu = new DialogVM()

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: AppVMProps, value: any) {
    ;(this[prop] as any) = value
  }

  /**
   * Helper to assign multiple props values through a mobx action.
   */
  public assign(props: { [key: string]: any }) {
    Object.assign(this, props)
  }

  public init() {
    mobx.reaction(
      () => this.rootStore.web3Connection.providerIsChanging,
      (isChanging) => {
        if (!isChanging) {
          this.providerMenu.hide()
        }
      }
    )

    mobx.reaction(
      () => this.headerMenu.visible || this.providerMenu.visible,
      (menuVisible) => {
        if (menuVisible) {
          document.body.classList.add('overflow')
        } else {
          document.body.classList.remove('overflow')
        }
      }
    )
  }

  constructor({ rootStore }: { rootStore: RootStore }) {
    this.rootStore = rootStore
    this.init()
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
