import _ from 'lodash'
import * as mobx from 'mobx'

/**
 * Expose viewport properties like size width / heigh as observable
 */
export default class ObservableViewport {
  private throttledUpdateViewportSize: () => void

  public static getViewPortSize() {
    return {
      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
    }
  }

  public size = ObservableViewport.getViewPortSize()

  public updateViewportSize() {
    this.size = ObservableViewport.getViewPortSize()
  }

  public destroy() {
    window.removeEventListener('resize', this.throttledUpdateViewportSize)
  }

  constructor() {
    // Track viewport dimensions
    this.throttledUpdateViewportSize = _.throttle(this.updateViewportSize.bind(this), 150, {
      leading: false,
    })
    window.addEventListener('resize', this.throttledUpdateViewportSize, {
      passive: true,
    })
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
