import { ReactComponent as LogoSign } from 'app-images/logo-sign.svg'
import { ReactComponent as LogoStaking } from 'app-images/logo-staking.svg'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'
import AppVM from '../AppVM'
import OnChainIndicator from './OnChainIndicator'

export function HeaderDesktop({ appVM }: { appVM: AppVM }) {
  return (
    <header>
      <div className="container container-md">
        <div className="flex jc-sb ai-c ta-c">
          <Link to="/" className="logo">
            <div className="logo-sign">
              <LogoSign />
            </div>
            <div className="logo-staking">
              <LogoStaking />
            </div>
          </Link>
          <div className="flex ai-c header-right">
            <a
              href="https://help.bzx.network/en/"
              className={`item-menu`}
              target="_blank"
              rel="noopener noreferrer">
              Help Center
            </a>
            <OnChainIndicator appVM={appVM} />
          </div>
        </div>
      </div>
    </header>
  )
}

export default observer(HeaderDesktop)
