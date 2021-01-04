import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import { AppRouter } from './components/AppRouter'
import services from './services'

import './styles/index.scss'

services.start()

Modal.setAppElement('#root')

ReactDOM.render(<AppRouter />, document.getElementById('root'))
