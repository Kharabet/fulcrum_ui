import React, { Component } from "react";
import { OnChainIndicator } from "../components/OnChainIndicator";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";
import { HeaderMenuToggle } from "./HeaderMenuToggle";

export interface IHeaderOpsProps {
  doNetworkConnect: () => void;
  isLoading: boolean;
}

interface IHeaderOpsState {
  isMobileMedia: boolean;
  isMenuOpen: boolean;
}

export class HeaderOps extends Component<IHeaderOpsProps, IHeaderOpsState> {
  private readonly mediaQueryList: MediaQueryList;
  private _menu: IHeaderMenuProps = {
    items: [
      { id: 0, title: "Home", link: "/", external: false },
      { id: 1, title: "Lend", link: "/lend", external: false },
      { id: 2, title: "Trade", link: "/trade", external: false },
      { id: 3, title: "Faq", link: "https://bzx.network/faq-fulcrum.html", external: true }
    ]
  };

  constructor(props: IHeaderOpsProps) {
    super(props);

    this.mediaQueryList = window.matchMedia("(max-width: 959px)");
    this.state = {
      isMobileMedia: this.mediaQueryList.matches,
      isMenuOpen: false
    };

    this.mediaQueryList.addEventListener("change", this.onMediaQueryListChange);
  }

  public render() {
    return !this.state.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }

  private renderDesktop = () => {
    return (
      <header className="header">
        <div className="header__row">
          <div className="header__left">
            <HeaderLogo />
          </div>
          <div className="header__center">
            <HeaderMenu items={this._menu.items} />
          </div>
          <div className="header__right">
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
          </div>
        </div>
      </header>
    );
  };

  private renderMobile = () => {
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
            <HeaderMenu items={this._menu.items} />
            <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
          </div>
        ) : null}
      </header>
    );
  };

  private onMediaQueryListChange = (event: MediaQueryListEvent) => {
    const matches = event.matches;

    if (matches !== this.state.isMobileMedia) {
      this.setState({ ...this.state, isMobileMedia: matches });
    }
  };

  private onMenuToggle = (value: boolean) => {
    this.setState({ ...this.state, isMenuOpen: value });
  };
}
