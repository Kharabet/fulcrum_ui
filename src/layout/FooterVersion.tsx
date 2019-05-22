import React, { Component } from "react";
import packageJson from "../../package.json";

export class FooterVersion extends Component {
  public render() {
    return (
      <div className="footer-version">
        <div className="footer-menu__item">Version Alpha {packageJson.version}</div>
        <div className="footer-menu__item">
          Powered by <a href="//bzx.network">bZx</a>
        </div>
      </div>
    );
  }
}
