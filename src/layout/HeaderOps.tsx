import React, { Component } from "react";
import { OnChainIndicator } from "../components/OnChainIndicator";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";

export interface IHeaderOpsProps {
  doNetworkConnect: () => void;
  isLoading: boolean;
}

export class HeaderOps extends Component<IHeaderOpsProps> {
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
          <OnChainIndicator isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} />
        </div>
      </header>
    );
  }
}
