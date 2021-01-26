import { ReactComponent as LogoSign } from 'app-images/logo-sign.svg'
import { ReactComponent as LogoStaking } from 'app-images/logo-staking.svg'
import { ReactComponent as MenuIconClose } from 'app-images/menu-close.svg'
import { ReactComponent as MenuIconOpen } from 'app-images/menu-open.svg'
import { observer } from 'mobx-react'
import React from 'react'
import { Link } from 'react-router-dom'
import ExternalLink from 'shared-components/ExternalLink'
import FooterSocial from 'shared-components/FooterSocial'
import AppVM from '../AppVM'
import OnChainIndicator from './OnChainIndicator'

export function HeaderMobile({ appVM }: { appVM: AppVM }) {
  return (
    <header className={`${appVM.headerMenu.visible ? `open-menu` : ``}`}>
      <div className="flex fd-c h-100">
        <div className="flex jc-sb ai-c px-15">
          <Link to="/" className="logo">
            <div className="logo-sign">
              <LogoSign />
            </div>
            <div className="logo-staking">
              <LogoStaking />
            </div>
          </Link>
          <div className="header_icon" onClick={appVM.headerMenu.toggle}>
            {!appVM.headerMenu.visible ? (
              <MenuIconOpen className="header__menu" />
            ) : (
              <MenuIconClose className="header__menu" />
            )}
          </div>
        </div>
        <div className={`mobile-menu ${appVM.headerMenu.visible ? `shown` : `hidden`}`}>
          <div className="w-100">
            <div className="flex-center">
              <OnChainIndicator appVM={appVM} />
            </div>
            <div className="header-menu txt-center">
              <Link
                to="/"
                className={`item-menu margin-bottom-1 ${
                  window.location.pathname === '/' ? `active` : ``
                }`}
                onClick={appVM.providerMenu.hide}>
                Dashboard
              </Link>
              <ExternalLink
                className="header__link margin-bottom-1"
                href="https://app.fulcrum.trade/trade"
                showIcon={true}>
                Trade
              </ExternalLink>
              <ExternalLink
                className="header__link margin-bottom-1"
                href="https://app.fulcrum.trade/lend"
                showIcon={true}>
                Lend
              </ExternalLink>
              <ExternalLink
                className="header__link margin-bottom-1"
                href="https://app.torque.loans"
                showIcon={true}>
                Borrow
              </ExternalLink>
              {/*<Link to="/transactions" className={`item-menu ${window.location.pathname === "/transactions" ? `active` : ``}`}  onClick={this.removeOverflow}>
                  Transactions
                </Link>*/}
              <a
                href="https://help.bzx.network/en/"
                className={`item-menu`}
                target="_blank"
                rel="noopener noreferrer">
                Help Center
              </a>
            </div>
          </div>

          <FooterSocial isShowSocial={!appVM.headerMenu.visible} />
        </div>
      </div>
    </header>
  )
}

export default observer(HeaderMobile)
