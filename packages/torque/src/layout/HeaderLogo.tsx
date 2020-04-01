import React, { Component } from "react";
import { Link } from "react-router-dom";

import { ReactComponent as TorqueLogo } from "../assets/images/torque_logo.svg";

export class HeaderLogo extends Component {
  public render() {
    return (
      <div className="header-logo">
        <Link to="/">
          <TorqueLogo />
        </Link>
      </div>
    );
  }
}
