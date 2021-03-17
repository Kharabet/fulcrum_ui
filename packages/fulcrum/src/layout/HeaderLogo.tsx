import { Link } from 'react-router-dom'
import { ReactComponent as BSCLogo } from 'bzx-common/src/assets/images/binance/bsc_logo.svg'
import { ReactComponent as FulcrumLogo } from '../assets/images/fulcrum_logo.svg'
import { ReactComponent as FulcrumLogoSign } from '../assets/images/fulcrum_logo_partial.svg'
import appConfig from 'bzx-common/src/config/appConfig'
import React from 'react'

function HeaderLogo() {
  return (
    <div className={`header-logo ${appConfig.isBsc ? 'bsc' : ''}`}>
      <Link to="/">
        <div className="fulcrum-logo-sign">
          <FulcrumLogoSign />
        </div>
        <div className="fulcrum-logo">
          <FulcrumLogo />
        </div>
        {appConfig.isBsc && (
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
