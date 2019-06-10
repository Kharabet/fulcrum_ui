import React, { Component } from "react";
import { Link } from "react-router-dom";

import torque_logo from "../assets/images/torque_logo.svg";

export class HeaderLogo extends Component {
  public render() {
    return (
      <div className="header-logo">
        <Link to="/">
          <img className="header-logo__image" src={torque_logo} alt="torque-logo" />
        </Link>
      </div>
    );
  }
}
