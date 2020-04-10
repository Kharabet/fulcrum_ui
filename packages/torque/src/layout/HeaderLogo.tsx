import React, { Component } from "react";
import { Link } from "react-router-dom";

import {ReactComponent as TorqueLogo} from "../assets/images/torque_logo.svg";
import {ReactComponent as TorqueLogoPartial} from "../assets/images/torque_logo_partial.svg";

export class HeaderLogo extends Component {
  public render() {
    return (
      <div className="header-logo">
        <Link to="/">
          <div className="header-logo-full">
            <TorqueLogo />
          </div>
          <div className="header-logo-partial">
            <TorqueLogoPartial />
          </div>
        </Link>
      </div>
    );
  }
}
