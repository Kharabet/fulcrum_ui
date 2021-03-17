import { HeaderLogo } from './HeaderLogo'
import { HeaderMenu, IHeaderMenuProps } from './HeaderMenu'
import { OnChainIndicator } from '../components/OnChainIndicator'
import { ReactComponent as MenuIconClose } from '../assets/images/ic_close.svg'
import { ReactComponent as MenuIconOpen } from '../assets/images/ic_menu.svg'
import { Tab } from '../domain/Tab'
import { TorqueProvider } from '../services/TorqueProvider'
import appConfig from 'bzx-common/src/config/appConfig'
import Footer from './Footer'
import React, { Component } from 'react'
import siteConfig from '../config/SiteConfig.json'

export interface IHeaderOpsProps {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
  setActiveTab: (tab: Tab) => void
}

interface IHeaderOpsState {
  isMenuOpen: boolean
}

export class HeaderOps extends Component<IHeaderOpsProps, IHeaderOpsState> {
  constructor(props: IHeaderOpsProps) {
    super(props)
    this.state = {
      isMenuOpen: false,
    }
  }

  private MenuDesktop: IHeaderMenuProps = {
    items: [
      {
        title: 'Trade',
        link: `https://${appConfig.isBsc ? 'bsc' : 'app'}.fulcrum.trade/trade`,
        external: true,
      },
      {
        title: 'Lend',
        link: `https://${appConfig.isBsc ? 'bsc' : 'app'}.fulcrum.trade/lend`,
        external: true,
      },
      { title: 'Borrow', link: '/borrow', external: false },
      { title: 'Stake', link: 'https://staking.bzx.network', external: true },
    ],
  }

  private MenuMobile: IHeaderMenuProps = {
    items: [
      {
        title: 'Trade',
        link: `https://${appConfig.isBsc ? 'bsc' : 'app'}.fulcrum.trade/trade`,
        external: true,
      },
      {
        title: 'Lend',
        link: `https://${appConfig.isBsc ? 'bsc' : 'app'}.fulcrum.trade/lend`,
        external: true,
      },
      { title: 'Borrow', link: '/borrow', external: false },
      { title: 'Stake', link: 'https://staking.bzx.network', external: true },
      { title: 'Borrow FAQ', link: 'https://torque.loans/', external: true },
      {
        title: 'Help Center',
        link: 'https://help.bzx.network/en/collections/2008807-torque',
        external: true,
      },
    ],
  }

  public componentWillUnmount(): void {
    document.body.style.overflow = ''
  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile()
  }

  private renderDesktop = () => {
    if (
      siteConfig.BorrowDisabled &&
      !(
        TorqueProvider.Instance.accounts.length > 0 &&
        TorqueProvider.Instance.accounts[0].toLowerCase() ===
          '0xadff3ada12ed0f8a87e31e5a04dfd2ee054e1118'
      )
    ) {
      this.MenuDesktop.items.splice(0, 1)
    }
    return (
      <header className="header">
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo setActiveTab={this.props.setActiveTab} />
          </div>
          <div className="header__center">
            <HeaderMenu items={this.MenuDesktop.items} />
          </div>
          <div className="header__right">
            <div className="header-menu__item">
              <a
                href="https://torque.loans/"
                className="header-menu__item-link c-primary-blue help-center"
                target="_blank"
                rel="noopener noreferrer">
                <span>Borrow FAQ</span>
              </a>
              <a
                href="https://help.bzx.network/en/collections/2008807-torque"
                className="header-menu__item-link c-primary-blue help-center"
                target="_blank"
                rel="noopener noreferrer">
                <span>Help Center</span>
              </a>
            </div>
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
          </div>
        </div>
      </header>
    )
  }

  private renderMobile = () => {
    const sidebarClass = !this.state.isMenuOpen ? 'sidebar_h' : 'sidebar_v'

    return (
      <React.Fragment>
        <header className="header">
          <div className="header__row">
            <div className="header__left">
              <HeaderLogo setActiveTab={this.props.setActiveTab} />
            </div>
            <div className="header_icon" onClick={this.onMenuToggle}>
              {!this.state.isMenuOpen ? (
                <MenuIconOpen className="header__menu" />
              ) : (
                <MenuIconClose className="header__menu" />
              )}
            </div>
          </div>
          {this.state.isMenuOpen ? (
            <div className={sidebarClass}>
              <div className="header_btn">
                <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
              </div>
              <div className="header_nav_menu">
                <HeaderMenu items={this.MenuMobile.items} />
              </div>
              <div className="footer-container">
                <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
              </div>
            </div>
          ) : null}
        </header>
      </React.Fragment>
    )
  }

  private onMenuToggle = () => {
    document.body.style.overflow = !this.state.isMenuOpen ? 'hidden' : ''
    this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen })
  }
}
