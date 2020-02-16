import React, { Component } from "react";
import { Link } from "react-router-dom";

import {ReactComponent as FulcrumLogo} from "../assets/images/fulcrum_logo.svg";

export class HeaderLogo extends Component {
  public render() {
    return (
      <div className="header-logo">
        <Link to="/">
          <FulcrumLogo />
        </Link>
      </div>
    );
  }
}
