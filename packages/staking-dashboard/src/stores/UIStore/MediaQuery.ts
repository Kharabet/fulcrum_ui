import ObservableViewport from './ObservableViewport'
import * as mobx from 'mobx'

enum breakPoints {
  small = 767,
  medium = 992,
}

/**
 * Observable screen media queries.
 */
export default class MediaQuery {
  public viewPort = new ObservableViewport()

  get smScreen() {
    return this.viewPort.size.width <= breakPoints.small
  }

  get mdMinusScreen() {
    return this.viewPort.size.width <= breakPoints.medium
  }

  get mdScreen() {
    return (
      this.viewPort.size.width > breakPoints.small && this.viewPort.size.width <= breakPoints.medium
    )
  }

  get mdPlusScreen() {
    return this.viewPort.size.width > breakPoints.small
  }

  get lgScreen() {
    return this.viewPort.size.width > breakPoints.medium
  }

  constructor() {
    mobx.makeAutoObservable(this, undefined, { autoBind: true, deep: false })
  }
}
