import React, { Component } from "react";
import packageJson from "../../package.json";

export class FooterVersion extends Component {
  public render() {
    return (
      <div className="footer-version">
        Version Alpha {packageJson.version}
      </div>
    );
  }
}
