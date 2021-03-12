import { Provider } from 'mobx-react'
import React from 'react'
import ReactDOM from 'react-dom'
import TagManager from 'react-gtm-module'
import App from './App'
import appConfig from 'bzx-common/src/config/appConfig'
import configProviders from 'bzx-common/src/config/providers.ts'
import stakingProvider from './services/StakingProvider'
import RootStore from './stores/RootStore'
import './styles/index.scss'

const rootStore = new RootStore({ stakingProvider })
rootStore.init()

if (appConfig.isMainnetProd) {
  const tagManagerArgs = {
    gtmId: configProviders.Google_TrackingID,
    dataLayer: {
      name: 'Home',
      status: 'Intailized',
    },
  }
  TagManager.initialize(tagManagerArgs)
}

if (process.env.NODE_ENV === 'development' || localStorage.getItem('devExposeStore')) {
  // Expose the rootStore to window for easy debug in dev
  // @ts-ignore
  window.rootStore = rootStore
}

ReactDOM.render(
  <Provider rootStore={rootStore}>
    <App />
  </Provider>,
  document.getElementById('root')
)
