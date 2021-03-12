import appConfig from 'bzx-common/src/config/appConfig'
import { FulcrumProvider } from './FulcrumProvider'
import sentryService from './sentryService'

/**
 * Start / Init services like Sentry
 */
function start() {
  if (appConfig.isMainnetProd) {
    sentryService.init(FulcrumProvider.Instance)
  }
}

export default {
  start
}
