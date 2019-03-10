import React, { Component } from "react";
import HeaderLogo from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";

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
        <HeaderLogo />
        <HeaderMenu items={this._menu.items} />
      </header>
    );
  }
}

export default Header;
