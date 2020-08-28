import React, { Component } from "react";
import { OnChainIndicator } from "../components/OnChainIndicator";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";
import ic_close from "../assets/images/ic_close.svg";
import menu_icon from "../assets/images/ic_menu.svg";
import { ReactComponent as MenuIconOpen } from "../assets/images/ic_menu.svg";
import { ReactComponent as MenuIconClose } from "../assets/images/ic_close.svg";
import { Footer } from "./Footer"
import { SwitchButtonInput } from "../components/SwitchButtonInput";
export interface IHeaderOpsProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
  headerClass: string;
}

interface IHeaderOpsState {
  isMenuOpen: boolean;
}

export class HeaderOps extends Component<IHeaderOpsProps, IHeaderOpsState> {

  constructor(props: IHeaderOpsProps) {
    super(props);

    this.state = {
      isMenuOpen: false
    };
  }

  public componentDidMount(): void {
    var currentTheme = localStorage.getItem('theme')!;
    var toggleSwitch = document.querySelector<HTMLInputElement>('.header__right .theme-switch input[type="checkbox"]');
    if (toggleSwitch && currentTheme) {
      if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        toggleSwitch.checked = false;
      }
      else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        toggleSwitch.checked = true;
      }
    };
  }

  public componentWillUnmount(): void {
    document.body.style.overflow = "";

  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }

  private renderDesktop = () => {

    const menu: IHeaderMenuProps = {
      items: [
        { id: 0, title: "Lend", link: "/lend", external: false },
        { id: 1, title: "Trade", link: "/trade", external: false },
        { id: 2, title: "Borrow", link: "https://torque.loans", external: true },
        { id: 3, title: "Stats", link: "/stats", external: false },
        { id: 4, title: "Help Center", link: "https://bzx.network/faq-fulcrum.html", external: true },
      ],
      onMenuToggle: this.onMenuToggle
    };

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
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
            <SwitchButtonInput onSwitch={this.onSwitchTheme} type="theme" />
          </div>
        </div>
      </header>
    );
  };

  private renderMobile = () => {

    const menu: IHeaderMenuProps = {
      items: [
        { id: 0, title: "Lend", link: "/lend", external: false },
        { id: 1, title: "Trade", link: "/trade", external: false },
        { id: 2, title: "Borrow", link: "https://torque.loans", external: true },
        { id: 3, title: "Stats", link: "/stats", external: false },
        { id: 4, title: "Help Center", link: "https://bzx.network/faq-fulcrum.html", external: true },
      ],
      onMenuToggle: this.onMenuToggle
    };
    const toggleImg = !this.state.isMenuOpen ? menu_icon : ic_close;
    const sidebarClass = !this.state.isMenuOpen ? 'sidebar_h' : 'sidebar_v'

    return (
      <header className={`header ${this.props.headerClass}`}>
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo />
          </div>
          <div className="header_icon" onClick={this.onMenuToggle}>
            {!this.state.isMenuOpen ? <MenuIconOpen className="header__menu" /> : <MenuIconClose className="header__menu" />}
          </div>

        </div>
        {this.state.isMenuOpen ? (

          <div className={sidebarClass}>
            <div className="header_btn">

              <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
              <div className="theme-switch-wrapper">
                <label className="theme-switch" htmlFor="checkbox">
                  <input type="checkbox" id="checkbox" onChange={this.onSwitchTheme} defaultChecked={!localStorage.theme || localStorage.theme === 'dark' ? true : false} />
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
    );
  };

  private onMenuToggle = () => {
    if (this.props.isMobileMedia) {
      document.body.style.overflow = !this.state.isMenuOpen ? "hidden" : "";
      this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen });
    }
  };

  private onSwitchTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const switchButton = e.currentTarget;
    if (switchButton.checked) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  };
}
