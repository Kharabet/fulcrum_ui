import React from 'react'
import ReactDOM from 'react-dom'
import { AppRouter } from './components/AppRouter'

import './styles/index.scss'

const isMainnetProd =
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'

if (isMainnetProd && window) {
  window.console.log = () => {}
}

ReactDOM.render(<AppRouter />, document.getElementById('root'))
