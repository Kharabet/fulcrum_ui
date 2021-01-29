import * as mobx from 'mobx'

type dialogProp = 'visible' | 'id'

/**
 * Generic View Model for simple dialogs.
 * It has a `visible` property that can be changed with `hide`/`show`/`toggle`
 */
export default class DialogVM {
  public id = ''
  public visible = false
  public transitionDelay = 0
  public hiding = false
  public showing = false
  public state: 'showing' | 'hiding' | 'visible' | 'hidden' = 'hidden'

  /**
   * Helper to set values through mobx actions.
   */
  public set(prop: dialogProp, value: any) {
    ;(this[prop] as any) = value
  }

  public show() {
    if (this.transitionDelay) {
      this.state = 'showing'
      setTimeout(() => {
        this.state = 'visible'
      }, this.transitionDelay)
    }
    this.visible = true
  }

  public hide(cb?: any) {
    if (this.transitionDelay) {
      this.state = 'hidden'
    }
    setTimeout(() => {
      this.visible = false
      if (typeof cb === 'function') {
        cb()
      }
    }, this.transitionDelay)
  }



  public toggle() {
    this.visible = !this.visible
  }

  /**
   * - __id__: optional id passed for debugging purposes
   * - __visible__: initial state of the dialog. Default: `false`
   * - __transitionDelay__: amount of time between the state hiding and visible false. Default: `0`
   */
  constructor(props?: { id?: string; visible?: boolean; transitionDelay?: number }) {
    if (props) {
      Object.assign(this, props)
    }
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
