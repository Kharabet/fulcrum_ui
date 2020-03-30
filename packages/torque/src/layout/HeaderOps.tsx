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
export interface IHeaderOpsProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  // isMobileMedia: boolean;
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

  /*public componentDidMount(): void {
  }*/

  /*public componentWillUnmount(): void {
  }*/

  public render() {
    // return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
    return this.renderDesktop();
  }



  private renderDesktop = () => {

    let menu: IHeaderMenuProps;
    if (TorqueProvider.Instance.providerType !== ProviderType.None) {
      menu = {
        items: [
          { id: 1, title: "Wallets", link: "/wallet/b", external: false },
          { id: 2, title: "Borrow", link: "/borrow/w", external: false },
          { id: 3, title: "Dashboard", link: "/dashboard/w", external: false },
          { id: 4, title: "Lend", link: "https://fulcrum.trade", external: true }
        ]
      };
    } else {
      menu = {
        items: [
          { id: 1, title: "Wallets", link: "/wallet/b", external: false },
          { id: 2, title: "Borrow", link: "/borrow/n", external: false },
          { id: 3, title: "Dashboard", link: "/dashboard/n", external: false },
          { id: 4, title: "Lend", link: "https://fulcrum.trade", external: true }
        ]
      };
    }

    const toggleMenuIcon = !this.state.isMenuOpen ? <OpenMenu /> : <CloseMenu />;
    const sidebarClass = !this.state.isMenuOpen ? 'sidebar_h' : 'sidebar_v'
    return (
      <header className="header">
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo />
          </div>
          <div className="header__center">
            <HeaderMenu items={menu.items} />
          </div>
          <div className="header__right">
            <a className="help__item" href="https://help.bzx.network/en/collections/2008807-torque">Help Center</a>
            <div className="header__provider">
              {TorqueProvider.Instance.providerType !== ProviderType.None ? (
                <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
              ) : ``}
            </div>
            <div className="header_icon" onClick={this.onMenuToggle}>
              <div className="toggle_icon">
                {toggleMenuIcon}
              </div>
            </div>
          </div>

        </div>

        <div className={sidebarClass}>
          <div className="sidebar_header">
            <HeaderLogo />
            <div className="header_icon" onClick={this.onMenuToggle}>
              <div className="toggle_icon">
                {toggleMenuIcon}
              </div>
            </div>
          </div>
          <div className="sidebar_content">
            <div className="header_btn">
              {TorqueProvider.Instance.providerType !== ProviderType.None ? (
                <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
              ) : ``}
            </div>
            <div className="heade_nav_menu">
              <HeaderMenu items={menu.items} />
              <a className="help__item" href="https://help.bzx.network/en/collections/2008807-torque">Help Center</a>
            </div>
          </div>
          <div className="sidebar_footer">
            <FooterVersion />
            <FooterMenu {...this.props}/>
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
  private onMenuToggle = () => {
    this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen });
  };


  /*private renderMobile = () => {

    const menu: IHeaderMenuProps = {
      items: [
        { id: 0, title: "Home", link: "/", external: false },
        { id: 1, title: "Lend", link: "/lend", external: false },
        { id: 3, title: "Faq", link: "https://bzx.network/faq-fulcrum.html", external: true }
      ]
    };

    return (
      <header className="header">
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo />
          </div>
          <div className="header__right">
            <HeaderMenuToggle isMenuOpen={this.state.isMenuOpen} onMenuToggle={this.onMenuToggle} />
          </div>
        </div>
        {this.state.isMenuOpen ? (
          <div className="header__popup-container">
            <HeaderMenu items={menu.items} />
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
          </div>
        ) : null}
      </header>
    );
  };

  private onMenuToggle = (value: boolean) => {
    this.setState({ ...this.state, isMenuOpen: value });
  };*/
}
