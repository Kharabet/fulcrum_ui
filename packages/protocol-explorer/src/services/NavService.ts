import { createBrowserHistory, History } from 'history'

export class NavService {
  public static Instance: NavService
  public readonly History: History

  constructor() {
    // init
    this.History = createBrowserHistory()

    // singleton
    if (!NavService.Instance) {
      NavService.Instance = this
    }

    return NavService.Instance
  }
}

// tslint:disable-next-line:no-unused-expression
new NavService()
