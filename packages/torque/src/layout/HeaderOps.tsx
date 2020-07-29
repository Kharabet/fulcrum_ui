import React, { Component } from "react";
import ic_close from "../assets/images/close.svg";
import menu_icon from "../assets/images/menu-icon.svg";
import { OnChainIndicator } from "../components/OnChainIndicator";
import { ProviderType } from "../domain/ProviderType";
import { TorqueProvider } from "../services/TorqueProvider";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";
import { HeaderMenuToggle } from "./HeaderMenuToggle";
import { InfoBlock } from "../components/InfoBlock";
import siteConfig from "../config/SiteConfig.json";
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

    if (siteConfig.BorrowDisabled && !(TorqueProvider.Instance.accounts.length > 0 && TorqueProvider.Instance.accounts[0].toLowerCase() === "0xadff3ada12ed0f8a87e31e5a04dfd2ee054e1118")) {
      menu.items.splice(1, 1);
    }

    const toggleImg = !this.state.isMenuOpen ? menu_icon : ic_close;
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
            <div className="header__provider">
              {TorqueProvider.Instance.providerType !== ProviderType.None ? (
                <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
              ) : ``}
            </div>
            <div className="header_icon" onClick={this.onMenuToggle}>
              <img className="header__menu" src={toggleImg} />
            </div>
          </div>

        </div>

        <div className={sidebarClass}>
          <div className="header_btn">
            {TorqueProvider.Instance.providerType !== ProviderType.None ? (
              <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
            ) : ``}
          </div>
          <div className="heade_nav_menu">
            <HeaderMenu items={menu.items} />
          </div>
        </div>

        <InfoBlock localstorageItemProp="torque-page-info">
          You may only manage and repay your existing loans. Full functionality will return after a thorough audit of our newly implemented and preexisting smart contracts.
        </InfoBlock>

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
