import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as BSCLogo } from 'bzx-common/src/assets/images/binance/bsc_logo.svg'
import { ReactComponent as FulcrumLogo } from '../assets/images/fulcrum_logo.svg'
import { ReactComponent as FulcrumLogoSign } from '../assets/images/fulcrum_logo_partial.svg'

const bsc = process.env.REACT_APP_ETH_NETWORK === 'bsc'

function HeaderLogo() {
  return (
    <div className={`header-logo ${bsc ? 'bsc' : ''}`}>
      <Link to="/">
        <div className="fulcrum-logo-sign">
          <FulcrumLogoSign />
        </div>
        <div className="fulcrum-logo">
          <FulcrumLogo />
        </div>
        {process.env.REACT_APP_ETH_NETWORK === 'bsc' && (
          <React.Fragment>
            <div className="bsc-logo">
              <BSCLogo />
            </div>
          </React.Fragment>
        )}
      </Link>
    </div>
  )
}

export default HeaderLogo
