import * as mobx from 'mobx'

type dialogProp = 'id' | 'state'

/**
 * Generic View Model for simple dialogs.
 * It has a `visible` property that can be changed with `hide`/`show`/`toggle`
 */
export default class DialogVM {
  public id = ''
  public transitionDelay = 0
  public state: 'showing' | 'hiding' | 'visible' | 'hidden' = 'hidden'

  public get visible() {
    return this.state === 'visible' || this.state === 'showing' || this.state === 'hiding'
  }

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
        this.set('state', 'visible')
      }, this.transitionDelay)
    } else {
      this.set('state', 'visible')
    }
  }

  /**
   * @param {function=} cb optional callback to run after once hidden. Useful if there is a transition.
   */
  public hide(cb?: any) {
    if (this.transitionDelay) {
      this.set('state', 'hiding')
      setTimeout(() => {
        this.set('state', 'hidden')
        if (typeof cb === 'function') {
          cb()
        }
      }, this.transitionDelay)
    } else {
      this.set('state', 'hidden')
    }
  }

  public toggle() {
    this.state === 'visible' ? this.hide() : this.show()
  }

  /**
   * - __id__: optional id passed for debugging purposes
   * - __visible__: initial state of the dialog. Default: `false`
   * - __transitionDelay__: amount of time between the state hiding and visible false. Default: `0`
   */
  constructor(props?: { id?: string; visible?: boolean; transitionDelay?: number }) {
    if (props) {
      const { visible, ...otherProps } = props
      Object.assign(this, otherProps)
      if (props.visible) {
        this.state = 'visible'
      }
    }
    mobx.makeObservable(this, {
      id: mobx.observable,
      visible: mobx.computed,
      transitionDelay: mobx.observable,
      state: mobx.observable,
      set: mobx.action.bound,
      show: mobx.action.bound,
      hide: mobx.action.bound,
      toggle: mobx.action.bound,
    })
  }
}
