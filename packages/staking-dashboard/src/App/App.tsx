import { Web3ReactProvider } from '@web3-react/core'
import React from 'react'
import Intercom from 'react-intercom'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import AppError from 'shared-components/AppError'
import Web3ReactExporter from 'shared-components/Web3ReactExporter'
import appConfig from 'bzx-common/src/config/appConfig'
import AppVM from './AppVM'
import Footer from './Footer'
import Header from './Header'
import ProviderMenu from './ProviderMenu'
import Staking from './Staking'

export default function App({ vm }: { vm: AppVM }) {
  const { stakingProvider } = vm.rootStore
  return (
    <React.Fragment>
      <Web3ReactProvider getLibrary={stakingProvider.getLibrary}>
        <Web3ReactExporter web3Connection={vm.rootStore.web3Connection} />
      </Web3ReactProvider>
      <ProviderMenu appVM={vm} />
      <Router>
        <>
          <Header appVM={vm} />
          <Switch>
            <Route exact={true} path="/">
              <Staking appVM={vm}/>
            </Route>
          </Switch>
        </>
      </Router>
      <AppError rootStore={vm.rootStore}/>
      <Footer />
      {appConfig.isMainnetProd ? <Intercom appID="dfk4n5ut" /> : null}
    </React.Fragment>
  )
}
