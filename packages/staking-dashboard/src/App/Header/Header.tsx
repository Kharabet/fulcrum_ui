import { ReactComponent as LogoSign } from 'app-images/logo-sign.svg'
import { ReactComponent as LogoStaking } from 'app-images/logo-staking.svg'
import { ReactComponent as MenuIconClose } from 'app-images/menu-close.svg'
import { ReactComponent as MenuIconOpen } from 'app-images/menu-open.svg'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'
import ExternalLink from 'shared-components/ExternalLink'
import { Button } from 'ui-framework'
import AppVM from '../AppVM'
import MobileMenu from './MobileMenu'
import OnChainIndicator from './OnChainIndicator'

export function Header({ appVM }: { appVM: AppVM }) {
  return (
    <header>
      <div className="container container-md">
        <div className="flex jc-sb ai-c">
          <Link to="/" className="header__logo">
            <div className="logo-sign">
              <LogoSign />
            </div>
            <div className="logo-staking">
              <LogoStaking />
            </div>
          </Link>
          <div className="flex-row md-visible">
            <ExternalLink
              className="header__link margin-right-3"
              href="https://app.fulcrum.trade/trade"
              showIcon={true}>
              Trade
            </ExternalLink>
            <ExternalLink
              className="header__link margin-right-3"
              href="https://app.fulcrum.trade/lend"
              showIcon={true}>
              Lend
            </ExternalLink>
            <ExternalLink
              className="header__link margin-right-3"
              href="https://app.torque.loans"
              showIcon={true}>
              Borrow
            </ExternalLink>
            <ExternalLink className="header__link active">Stake</ExternalLink>
          </div>
          <div className="flex-row-center flex-row-end">
            <div className="sm-visible">
              <div className="flex ai-c header-right">
                <ExternalLink
                  href="https://bzx.network/blog/staking-bzrx"
                  className="header__item-menu">
                  Staking FAQ
                </ExternalLink>
                <OnChainIndicator appVM={appVM} />
              </div>
            </div>
            <Button
              variant="invisible"
              className="header_icon md-hidden margin-left-2"
              onClick={appVM.headerMenu.toggle}>
              {!appVM.headerMenu.visible ? (
                <MenuIconOpen className="header__menu" />
              ) : (
                <MenuIconClose className="header__menu" />
              )}
            </Button>
          </div>
          <MobileMenu appVM={appVM} />
        </div>
      </div>
    </header>
  )
}

export default observer(Header)
