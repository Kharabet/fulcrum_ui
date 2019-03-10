import React, { Component } from "react";
import HeaderLogo from "./HeaderLogo";
import { HeaderMenu, IHeaderMenuProps } from "./HeaderMenu";

class Header extends Component {
  private _menu: IHeaderMenuProps = { items: [
      { id: 0, title: "About us", link: "/about-us" }
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
