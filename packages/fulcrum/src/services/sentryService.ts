import * as Sentry from '@sentry/browser'
import type { EventEmitter } from 'events'
import appConfig from '../config/appConfig'

/**
 * Allow to add user address as id for bug reports in Sentry
 * @param address user current wallet address. If undefined is passed, sentry scope will be reset.
 */
function setWalletAddressAsId (address?: string) {
  if (typeof address === 'string') {
    Sentry.configureScope((scope) => {
      scope.setUser({id: address})
    })
  }
  else {
    Sentry.configureScope((scope) => {
      scope.clear()
    })
  }
}

/**
 * @param provider Pass the provider (Fulcrum/Staking Provider)
 */
function init (provider: {getCurrentAccount: () => string | undefined, eventEmitter: EventEmitter}) {
  Sentry.init({
    dsn: 'https://ee577e18ed6645bfaaac30fb29e63460@o479738.ingest.sentry.io/5525206',
    release: `fulcrum-${appConfig.releaseVersion}`
  })

  provider.eventEmitter.on('ProviderChanged', () => {
    setWalletAddressAsId(provider.getCurrentAccount())
  })
}

export default {
  init
}
