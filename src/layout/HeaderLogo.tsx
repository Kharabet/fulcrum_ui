import React, { Component } from "react";
import fulcrum_logo from "../assets/fulcrum_logo.svg";
import { Link } from "react-router-dom";

class HeaderLogo extends Component {
  render() {
    return (
      <div className="header-logo">
        <Link to="/">
          <img className="header-logo__image" src={fulcrum_logo} alt="fulcrum-logo"/>
        </Link>
      </div>
    );
  }
}

export default HeaderLogo;
