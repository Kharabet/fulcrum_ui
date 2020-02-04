import React, { Component } from "react";
import { OnChainIndicator } from "../components/OnChainIndicator";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";
import { HeaderMenuToggle } from "./HeaderMenuToggle";
import ic_close from "../assets/images/ic_close.svg";
import menu_icon from "../assets/images/ic_menu.svg";
import {TorqueProvider} from "../../../torque/src/services/TorqueProvider";
import {ProviderType} from "../../../torque/src/domain/ProviderType";

``

export interface IHeaderOpsProps {
  doNetworkConnect: () => void;
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

  /*public componentDidMount(): void {
  }*/

  /*public componentWillUnmount(): void {
  }*/

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }

  private renderDesktop = () => {

    const menu: IHeaderMenuProps = {
      items: [
        { id: 0, title: "Home", link: "/", external: false },
        { id: 1, title: "Lend", link: "/lend", external: false },
        { id: 2, title: "Trade", link: "/trade", external: false },
        { id: 3, title: "Borrow", link: "https://torque.loans", external: true },
        { id: 4, title: "Faq", link: "https://bzx.network/faq-fulcrum.html", external: true },
        { id: 5, title: "Stats", link: "/stats", external: false },
      ]
    };

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
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
          </div>
        </div>
      </header>
    );
  };

  private renderMobile = () => {

    const menu: IHeaderMenuProps = {
      items: [
        { id: 0, title: "Home", link: "/", external: false },
        { id: 1, title: "Lend", link: "/lend", external: false },
        { id: 2, title: "Trade", link: "/trade", external: false },
        { id: 3, title: "Borrow", link: "https://torque.loans", external: true },
        { id: 4, title: "Faq", link: "https://bzx.network/faq-fulcrum.html", external: true },
        { id: 5, title: "Stats", link: "/stats", external: false },
      ]
    };
    const toggleImg = !this.state.isMenuOpen ? menu_icon : ic_close;
    const sidebarClass = !this.state.isMenuOpen ? 'sidebar_h' : 'sidebar_v'

    return (
      <header className="header">
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo />
          </div>
          <div className="header_icon" onClick={this.onMenuToggle}>
              <img className="header__menu" src={toggleImg} />
            </div>
          {/*<div className="header__right">*/}
            {/*<HeaderMenuToggle isMenuOpen={this.state.isMenuOpen} onMenuToggle={this.onMenuToggle} />*/}
          {/*</div>*/}
        </div>
        {this.state.isMenuOpen ? (

          <div className={sidebarClass}>
            <div className="header_btn">

              <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />

            </div>
            <div className="heade_nav_menu">
              <HeaderMenu items={menu.items} />
            </div>
          </div>
        ) : null}
      </header>
    );
  };

  private onMenuToggle = () => {
    this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen });
  };
}
