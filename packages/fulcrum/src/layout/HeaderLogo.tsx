import React, { Component } from "react";
import { Link } from "react-router-dom";

import {ReactComponent as FulcrumLogo} from "../assets/images/fulcrum_logo.svg";
import {ReactComponent as FulcrumLogoPartial} from "../assets/images/fulcrum_logo_partial.svg";

export class HeaderLogo extends Component {
  public render() {
    return (
      <div className="header-logo">
        <Link to="/">
          <div className="header-logo-full">
            <FulcrumLogo />
          </div>
          <div className="header-logo-partial">
            <FulcrumLogoPartial />
          </div>
        </Link>
      </div>
    );
  }
}
