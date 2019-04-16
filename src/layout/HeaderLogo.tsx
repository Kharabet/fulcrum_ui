import React, { Component } from "react";
import { Link } from "react-router-dom";

import fulcrum_logo from "../assets/images/fulcrum_logo.svg";

export class HeaderLogo extends Component {
  public render() {
    return (
      <div className="header-logo">
        <Link to="/">
          <img className="header-logo__image" src={fulcrum_logo} alt="fulcrum-logo" />
        </Link>
      </div>
    );
  }
}
