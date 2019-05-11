import React, { Component } from "react";
import { FooterMenu } from "./FooterMenu";
import { FooterVersion } from "./FooterVersion";

export class Footer extends Component {
  public render() {
    return (
      <footer className="footer">
        <FooterVersion />
        <FooterMenu />
      </footer>
    );
  }
}
