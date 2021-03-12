import React, { Component } from 'react'
import { OnChainIndicator } from '../components/OnChainIndicator'
import HeaderLogo from './HeaderLogo'
import { HeaderMenu, IHeaderMenuProps } from './HeaderMenu'
import ic_close from '../assets/images/ic_close.svg'
import menu_icon from '../assets/images/ic_menu.svg'
import { ReactComponent as MenuIconOpen } from '../assets/images/ic_menu.svg'
import { ReactComponent as MenuIconClose } from '../assets/images/ic_close.svg'
import Footer from './Footer'
import { SwitchButtonInput } from '../components/SwitchButtonInput'
import { profileEnd } from 'console'

export interface IHeaderOpsProps {
  doNetworkConnect: () => void
  isRiskDisclosureModalOpen: () => void
  isMobileMedia: boolean
  headerClass: string
}

interface IHeaderOpsState {
  isMenuOpen: boolean
  scrollMenu: boolean
  heightDevice: number
}

export class HeaderOps extends Component<IHeaderOpsProps, IHeaderOpsState> {
  constructor(props: IHeaderOpsProps) {
    super(props)

    this.state = {
      isMenuOpen: false,
      scrollMenu: false,
      heightDevice: 0,
    }
  }

  public componentDidMount(): void {
    var currentTheme = localStorage.getItem('theme')!
    var toggleSwitch = document.querySelector<HTMLInputElement>(
      '.header__right .theme-switch input[type="checkbox"]'
    )
    if (currentTheme === null) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
      if (toggleSwitch) toggleSwitch.checked = true
    }
    if (toggleSwitch && currentTheme) {
      if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
        toggleSwitch.checked = false
      } else {
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
        toggleSwitch.checked = true
      }
    }
    var heightDevice = document.documentElement.clientHeight
    if (heightDevice < 620) this.setState({ ...this.state, scrollMenu: true })

    window.addEventListener('resize', this.didResize.bind(this))
    this.didResize()
  }

  public componentWillUnmount(): void {
    document.body.className = ''
  }

  public didResize = () => {
    var heightDevice = document.documentElement.clientHeight
    heightDevice < 620
      ? this.setState({ ...this.state, scrollMenu: true })
      : this.setState({ ...this.state, scrollMenu: false })
    if (this.props.isMobileMedia) {
      this.state.isMenuOpen
        ? !this.state.scrollMenu
          ? (document.body.className = 'hidden')
          : (document.body.className = 'scroll')
        : (document.body.className = '')
    }
  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile()
  }

  private renderDesktop = () => {
    const menu: IHeaderMenuProps = {
      items: [
        { title: 'Trade', link: '/trade', external: false },
        { title: 'Lend', link: '/lend', external: false },

        {
          title: 'Borrow',
          link: `https://${
            process.env.REACT_APP_ETH_NETWORK === 'bsc' ? 'bsc' : 'app'
          }.torque.loans/borrow`,
          external: true,
        },
        { title: 'Stake', link: 'https://staking.bzx.network', external: true },
      ],
      onMenuToggle: this.onMenuToggle,
    }

    return (
      <header className={`header ${this.props.headerClass}`}>
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo />
          </div>
          <div className="header__center">
            <HeaderMenu items={menu.items} onMenuToggle={this.onMenuToggle} />
          </div>
          <div className="header__right">
            <div className="header__right__list">
              <a
                className="header__right__list-item"
                href={`${
                  this.props.headerClass === 'trade'
                    ? 'https://fulcrum.trade/'
                    : 'https://fulcrum.trade/lending'
                }`}
                target="_blank"
                rel="noopener noreferrer">
                {this.props.headerClass === 'trade' ? 'Trade FAQ' : 'Lend FAQ'}
              </a>
              <a
                className="header__right__list-item"
                href="https://bzx.network/faq-fulcrum.html"
                target="_blank"
                rel="noopener noreferrer">
                Help Center
              </a>
            </div>
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
            <SwitchButtonInput onSwitch={this.onSwitchTheme} type="theme" />
          </div>
        </div>
      </header>
    )
  }

  private renderMobile = () => {
    const menu: IHeaderMenuProps = {
      items: [
        { title: 'Trade', link: '/trade', external: false },
        { title: 'Lend', link: '/lend', external: false },
        {
          title: 'Borrow',
          link: `https://${
            process.env.REACT_APP_ETH_NETWORK === 'bsc' ? 'bsc' : 'app'
          }.torque.loans/borrow`,
          external: true,
        },
        {
          title: 'Stake',
          link: 'https://staking.bzx.network',
          external: true,
        },
        {
          title: `${this.props.headerClass === 'trade' ? 'Trade FAQ' : 'Lend FAQ'}`,
          link: `${
            this.props.headerClass === 'trade'
              ? 'https://fulcrum.trade/'
              : 'https://fulcrum.trade/lending'
          }`,
          external: true,
        },
        {
          title: 'Help Center',
          link: 'https://bzx.network/faq-fulcrum.html',
          external: true,
        },
      ],
      onMenuToggle: this.onMenuToggle,
    }
    const toggleImg = !this.state.isMenuOpen ? menu_icon : ic_close
    const sidebarClass = !this.state.isMenuOpen ? 'sidebar_h' : 'sidebar_v'

    return (
      <header className={`header ${this.props.headerClass}`}>
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo />
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
              <div className="theme-switch-wrapper">
                <label className="theme-switch" htmlFor="checkbox">
                  <input
                    type="checkbox"
                    id="checkbox"
                    onChange={this.onSwitchTheme}
                    defaultChecked={
                      !localStorage.theme || localStorage.theme === 'dark' ? true : false
                    }
                  />
                  <div className="slider round"></div>
                </label>
              </div>
            </div>
            <div className="header_nav_menu">
              <HeaderMenu items={menu.items} onMenuToggle={this.onMenuToggle} />
            </div>
            <div className="footer-container">
              <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
            </div>
          </div>
        ) : null}
      </header>
    )
  }

  private onMenuToggle = () => {
    if (this.props.isMobileMedia) {
      !this.state.isMenuOpen
        ? !this.state.scrollMenu
          ? document.body.classList.add('hidden')
          : document.body.classList.add('scroll')
        : (document.body.className = '')
    }
    this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen })
  }

  private onSwitchTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const switchButton = e.currentTarget
    if (switchButton.checked) {
      document.documentElement.setAttribute('data-theme', 'dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.setAttribute('data-theme', 'light')
      localStorage.setItem('theme', 'light')
    }
  }
}
