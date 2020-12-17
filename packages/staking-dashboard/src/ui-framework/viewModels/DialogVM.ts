import * as mobx from 'mobx'

type dialogProp = 'visible' | 'id'

/**
 * Generic View Model for simple dialogs.  
 * It has a `visible` property that can be changed with `hide`/`show`/`toggle`
 */
export default class DialogVM {
  public id = ''
  public visible = false

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: dialogProp, value: any) {
    ;(this[prop] as any) = value
  }

  public hide() {
    this.visible = false
  }

  public show() {
    this.visible = true
  }

  public toggle() {
    this.visible = !this.visible
  }

  /**
   * - __id__: optional id passed for debugging purposes
   * - __visible__: initial state of the dialog. Default: `false`
   */
  constructor(props?: { id?: string; visible?: boolean }) {
    if (props) {
      Object.assign(this, props)
    }
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
