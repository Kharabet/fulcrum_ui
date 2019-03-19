import React, { Component } from "react";
import HeaderLogo from "./HeaderLogo";

class Header extends Component {
  render() {
    return (
      <header className="header">
        <HeaderLogo />
      </header>
    );
  }
}

export default Header;
