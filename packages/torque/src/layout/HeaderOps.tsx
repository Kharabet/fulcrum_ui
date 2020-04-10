import React, { Component } from "react";
import { ReactComponent as CloseMenu } from "../assets/images/close.svg";
import { ReactComponent as OpenMenu } from "../assets/images/menu-icon.svg";
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

export interface IHeaderOpsProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
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
      { id: 3, title: "Refinance", link: "/refinance", external: false },
      { id: 4, title: "Lend", link: "https://fulcrum.trade", external: true },
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

    const toggleMenuIcon = !this.state.isMenuOpen ? <OpenMenu /> : <CloseMenu />;
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
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
            {/* <div className="theme-switch-wrapper">
              <label className="theme-switch">
                <input type="checkbox" id="checkbox" onChange={this.onSwitchTheme} />
                <div className="slider round"></div>
              </label>
            </div> */}
          </div>
        </div>
        <InfoBlock localstorageItemProp="torque-risk-notice" onAccept={() => { this.forceUpdate() }}>
          For your safety, please ensure the URL in your browser starts with: https://torque.loans/. <br />
        Torque is a non-custodial platform for borrowing digital assets. <br />
        "Non-custodial" means YOU are responsible for the security of your digital assets. <br />
        To learn more about how to stay safe when using Torque and other bZx products, please read our <button className="disclosure-link" onClick={this.props.isRiskDisclosureModalOpen}>DeFi Risk Disclosure</button>.
        </InfoBlock>
        {localStorage.getItem("torque-risk-notice") ?
          <InfoBlock localstorageItemProp="torque-page-info">
            You may only manage and repay your existing loans. Full functionality will return after a thorough audit of our newly implemented and preexisting smart contracts.
        </InfoBlock>
          : null}
      </header>
    );
  };



  private renderMobile = () => {

    const sidebarClass = !this.state.isMenuOpen ? 'sidebar_h' : 'sidebar_v'

    return (
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
            <div className="heade_nav_menu">
              <HeaderMenu items={this.Menu.items} />
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
    document.body.style.overflow = !this.state.isMenuOpen ? "hidden" : "";
    this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen });
  };
}
