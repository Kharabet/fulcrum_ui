import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'
import ExternalLink from 'shared-components/ExternalLink'
import AppVM from '../AppVM'
import OnChainIndicator from './OnChainIndicator'

const styles = {
  links: { width: '110px' },
}

export function MobileMenu({ appVM }: { appVM: AppVM }) {
  return (
    <div className={`flex-col mobile-menu ${appVM.headerMenu.visible ? `shown` : `hidden`}`}>
      <div className="w-100">
        <div className="flex-center sm-hidden">
          <OnChainIndicator appVM={appVM} />
        </div>
        <div className="center-block margin-top-2" style={styles.links}>
          <div className="margin-bottom-2">
            <Link to="/" className="header__item-menu active" onClick={appVM.providerMenu.hide}>
              Staking
            </Link>
          </div>
          <div className="margin-bottom-2">
            <ExternalLink
              targetBlank={false}
              className="header__link"
              href="https://app.fulcrum.trade/trade">
              Trade
            </ExternalLink>
          </div>
          <div className="margin-bottom-2">
            <ExternalLink
              targetBlank={false}
              className="header__link"
              href="https://app.fulcrum.trade/lend">
              Lend
            </ExternalLink>
          </div>
          <div className="margin-bottom-2">
            <ExternalLink
              targetBlank={false}
              className="header__link"
              href="https://app.torque.loans">
              Borrow
            </ExternalLink>
          </div>
          <div className="margin-bottom-2 sm-hidden">
            <ExternalLink
              targetBlank={true}
              href="https://bzx.network/blog/staking-bzrx"
              showIcon={true}
              className="header__item-menu">
              Staking FAQ
            </ExternalLink>
          </div>
        </div>
      </div>
    </div>
  )
}

export default observer(MobileMenu)
