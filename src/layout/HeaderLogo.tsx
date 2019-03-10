import React, { Component } from "react";
import logo from "../assets/logo.svg";

class HeaderLogo extends Component {
  render() {
    return (
      <div className="header-logo">
        <img className="header-logo__image" src={logo} alt="fulcrum-logo"/>
      </div>
    );
  }
}

export default HeaderLogo;
