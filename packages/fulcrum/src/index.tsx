import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { AppRouter } from './components/AppRouter'
import services from './services'
import log from 'loglevel'
import './styles/index.scss'

const isMainnetProd =
  process.env.NODE_ENV &&
  process.env.NODE_ENV !== 'development' &&
  process.env.REACT_APP_ETH_NETWORK === 'mainnet'

if (isMainnetProd) {
  log.setLevel(log.levels.ERROR)
} else{
  log.setLevel(log.levels.TRACE)
}
//@ts-ignore
window.log = log

services.start()

Modal.setAppElement('#root')

ReactDOM.render(<AppRouter />, document.getElementById('root'))
