import * as Sentry from '@sentry/browser'
import type { EventEmitter } from 'events'
import appConfig from 'bzx-common/src/config/appConfig'
import regexUtils from '../lib/regexUtils'

/**
 * Filter some events that should not be reported in Sentry
 */
const checkEventFilter = regexUtils.getWordListCheck([
  'ResizeObserver', // this is a browser bug
  'XDR encoding' // browser bug in Firefox especially
])

/**
 * Allow to add user address as id for bug reports in Sentry
 * @param address user current wallet address. If undefined is passed, sentry scope will be reset.
 */
function setWalletAddressAsId(address?: string) {
  if (typeof address === 'string') {
    Sentry.configureScope((scope) => {
      scope.setUser({ id: address })
    })
  } else {
    Sentry.configureScope((scope) => {
      scope.clear()
    })
  }
}

/**
 * @param provider Pass the provider instance (Fulcrum/Staking Provider)
 */
function init(provider: {
  getCurrentAccount: () => string | undefined
  eventEmitter: EventEmitter
}) {
  Sentry.init({
    dsn: 'https://ee577e18ed6645bfaaac30fb29e63460@o479738.ingest.sentry.io/5525206',
    release: `fulcrum-${appConfig.releaseVersion}`,
    beforeSend(event, hint) {
      // https://docs.sentry.io/platforms/javascript/configuration/filtering/
      const error = hint?.originalException
      if (error instanceof Error && checkEventFilter(error.message)) {
        return null
      }
      return event
    }
  })

  provider.eventEmitter.on('ProviderChanged', () => {
    setWalletAddressAsId(provider.getCurrentAccount())
  })
}

export default {
  init
}
