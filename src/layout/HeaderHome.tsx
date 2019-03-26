import React, { Component } from "react";
import { HeaderLogo } from "./HeaderLogo";

export class HeaderHome extends Component {
  public render() {
    return (
      <header className="header">
        <HeaderLogo />
      </header>
    );
  }
}
