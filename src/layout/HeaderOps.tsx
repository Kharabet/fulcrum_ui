import React, { Component } from "react";
import HeaderLogo from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";
import { OnChainIndicator } from "../components/OnChainIndicator";

class Header extends Component {
  private _menu: IHeaderMenuProps = {
    items: [
      { id: 0, title: "Home", link: "/" },
      { id: 1, title: "Lend", link: "/lend" },
      { id: 2, title: "Trade", link: "/trade" }
    ]
  };

  render() {
    return (
      <header className="header">
        <div className="header__left">
          <HeaderLogo />
        </div>
        <div className="header__center">
          <HeaderMenu items={this._menu.items} />
        </div>
        <div className="header__right">
          <OnChainIndicator />
        </div>
      </header>
    );
  }
}

export default Header;
