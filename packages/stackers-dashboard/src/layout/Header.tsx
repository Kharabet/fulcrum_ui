import React, { Component } from "react";
import { ReactComponent as LogoBzx } from "../assets/images/logo-stacker.svg"
import { HeaderMenu } from "./HeaderMenu";
import { Link } from "react-router-dom";
import { OnChainIndicator } from "../components/OnChainIndicator";
import { FooterSocial } from "../layout/FooterSocial";
import { ReactComponent as MenuIconClose } from "../assets/images/menu-close.svg";
import { ReactComponent as MenuIconOpen } from "../assets/images/menu-open.svg";

interface IHeaderProps {
  doNetworkConnect: () => void;
  isMobileMedia: boolean;
}

interface IHeaderState {
  isMenuOpen: boolean;
}

export class Header extends Component<IHeaderProps, IHeaderState> {
  constructor(props: IHeaderProps) {
    super(props);
    this.state = {
      isMenuOpen: false
    };
  }

  componentDidUpdate(prevProps: IHeaderProps, prevState: IHeaderState): void {
    if (this.state.isMenuOpen !== prevState.isMenuOpen) {
      this.state.isMenuOpen ? document.body.classList.add("overflow") : document.body.classList.remove("overflow");
    }
  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }

  private renderDesktop = () => {
    return (
      <header>
        <div className="container container-md">
          <div className="flex jc-sb ai-c ta-c">
            <Link to="/" className="logo">
              <LogoBzx />
            </Link>
            {/*<HeaderMenu />*/}
            <div className="flex ai-c header-right">
              <a href="https://help.bzx.network/en/" className={`item-menu`} target="_blank">
                Help Center
                </a>
              <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
            </div>
          </div>
        </div>
      </header>
    );
  }

  private renderMobile = () => {
    return (
      <header className={`${this.state.isMenuOpen ? `open-menu` : ``}`}>
        <div className="flex fd-c h-100">
          <div className="flex jc-sb ai-c w-100 px-15">
            <Link to="/" className="logo">
              <LogoBzx />
            </Link>
            <div className="header_icon" onClick={this.onMenuToggle}>
              {!this.state.isMenuOpen ? <MenuIconOpen className="header__menu" /> : <MenuIconClose className="header__menu" />}
            </div>
          </div>
          <div className={`mobile-menu ${this.state.isMenuOpen ? `shown` : `hidden`}`}>
            <div className="w-100">
              <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
              <div className="header-menu">
                <Link to="/" className={`item-menu ${window.location.pathname === "/" ? `active` : ``}`} onClick={this.removeOverflow}>
                  Dashboard
                </Link>
                {/*<Link to="/transactions" className={`item-menu ${window.location.pathname === "/transactions" ? `active` : ``}`}  onClick={this.removeOverflow}>
                  Transactions
                </Link>*/}
                <a href="https://help.bzx.network/en/" className={`item-menu`} target="_blank">
                  Help Center
                </a>
              </div>
            </div>

            <FooterSocial isShowSocial={!this.state.isMenuOpen} />
          </div>
        </div>
      </header>
    );
  }

  private onMenuToggle = () => {
    this.setState({ ...this.state, isMenuOpen: !this.state.isMenuOpen });
  };

  public removeOverflow = () => {
    document.body.classList.remove("overflow");
  }
}