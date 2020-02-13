import React, { Component } from "react";
import { FooterMenu } from "./FooterMenu";
import { FooterVersion } from "./FooterVersion";

interface IFooterProps {
  isMobileMedia: boolean;
}

export class Footer extends Component<IFooterProps> {
  public render() {
    return (
      <footer className="footer">
        <FooterVersion />
        <FooterMenu {...this.props} />
      </footer>
    );
  }
}
