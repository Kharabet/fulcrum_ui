import React, { Component } from "react";
import { OnChainIndicator } from "../components/OnChainIndicator";
import { ProviderType } from "../domain/ProviderType";
import { TorqueProvider } from "../services/TorqueProvider";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";
import { HeaderMenuToggle } from "./HeaderMenuToggle";
import { InfoBlock } from "../components/InfoBlock";
import { FooterMenu } from "./FooterMenu";
import { FooterVersion } from "./FooterVersion"

import { ReactComponent as MenuIconOpen } from "../assets/images/ic_menu.svg";
import { ReactComponent as MenuIconClose } from "../assets/images/ic_close.svg";
import { Footer } from "./Footer"

import siteConfig from "../config/SiteConfig.json";
export interface IHeaderOpsProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isMobileMedia: boolean;
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

  private Menu: IHeaderMenuProps = {
    items: [
      { id: 1, title: "Borrow", link: "/borrow", external: false },
      { id: 2, title: "Your Loans", link: "/dashboard", external: false },
      // { id: 3, title: "Refinance", link: "/refinance", external: false },
      { id: 4, title: "Lend", link: "https://app.fulcrum.trade/lend", external: true },
      { id: 5, title: "Help Center", link: "https://help.bzx.network/en/collections/2008807-torque", external: true },
    ]
  }

  /*public componentDidMount(): void {
  }*/

  public componentWillUnmount(): void {
    document.body.style.overflow = "";

  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }



  private renderDesktop = () => {

    if (siteConfig.BorrowDisabled && !(TorqueProvider.Instance.accounts.length > 0 && TorqueProvider.Instance.accounts[0].toLowerCase() === "0xadff3ada12ed0f8a87e31e5a04dfd2ee054e1118")) {
      this.Menu.items.splice(0, 1);
    }
    const sidebarClass = !this.state.isMenuOpen ? 'sidebar_h' : 'sidebar_v'
    return (
      <header className="header">
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo />
          </div>
          <div className="header__center">
            <HeaderMenu items={this.Menu.items} />
          </div>
          <div className="header__right">
            <div className="header-menu__item">
              <a href="https://help.bzx.network/en/collections/2008807-torque" className="header-menu__item-link c-primary-blue help-center">
                <span>Help Center</span>
              </a>
            </div>
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
            {/* <div className="theme-switch-wrapper">
              <label className="theme-switch">
                <input type="checkbox" id="checkbox" onChange={this.onSwitchTheme} />
                <div className="slider round"></div>
              </label>
            </div> */}
          </div>
        </div>

        {<InfoBlock localstorageItemProp="torque-page-info" isAccept={true}>
          Earn farming rewards! When trading or borrowing you are earning vBZRX while your position is open. Rewards are deposited weekly in your staking dashboard.
        </InfoBlock>
        }
      </header>
    );
  };



  private renderMobile = () => {

    const sidebarClass = !this.state.isMenuOpen ? 'sidebar_h' : 'sidebar_v'

    return (
      <React.Fragment>
        <header className="header">
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
                {/* <div className="theme-switch-wrapper">
                <label className="theme-switch" htmlFor="checkbox">
                  <input type="checkbox" id="checkbox" onChange={this.onSwitchTheme} defaultChecked={!localStorage.theme || localStorage.theme === 'dark' ? true : false} />
                  <div className="slider round"></div>
                </label>
              </div> */}
              </div>
              <div className="header_nav_menu">
                <HeaderMenu items={this.Menu.items} />
              </div>
              <div className="footer-container">
                <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
              </div>
            </div>
          ) : null}
        </header>
        <InfoBlock localstorageItemProp="torque-page-info" isAccept={true}>
          Earn farming rewards! When trading or borrowing you are earning vBZRX while your position is open. Rewards are deposited weekly in your staking dashboard.
        </InfoBlock>
      </React.Fragment>
    );
  };

  private onMenuToggle = () => {
    document.body.style.overflow = !this.state.isMenuOpen ? "hidden" : "";
    this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen });
  };
}
