import React, { Component } from "react";
import { IOnChainIndicatorParams, OnChainIndicator } from "../components/OnChainIndicator";
import HeaderLogo from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";

export interface IHeaderOpsParams extends IOnChainIndicatorParams {}

class HeaderOps extends Component<IHeaderOpsParams> {
  private _menu: IHeaderMenuProps = {
    items: [
      { id: 0, title: "Home", link: "/" },
      { id: 1, title: "Lend", link: "/lend" },
      { id: 2, title: "Trade", link: "/trade" }
    ]
  };

  public render() {
    return (
      <header className="header">
        <div className="header__left">
          <HeaderLogo />
        </div>
        <div className="header__center">
          <HeaderMenu items={this._menu.items} />
        </div>
        <div className="header__right">
          <OnChainIndicator provider={this.props.provider} onNetworkConnect={this.props.onNetworkConnect} />
        </div>
      </header>
    );
  }
}

export default HeaderOps;
