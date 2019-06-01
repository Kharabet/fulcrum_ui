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
      { id: 0, title: "Home", link: "/", external: false },
      { id: 1, title: "Lend", link: "/lend", external: false },
      { id: 2, title: "Trade", link: "/trade", external: false },
      { id: 3, title: "Faq", link: "https://bzx.network/faq-fulcrum.html", external: true }
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
          <OnChainIndicator doNetworkConnect={this.props.doNetworkConnect} />
        </div>
      </header>
    );
  }
}
