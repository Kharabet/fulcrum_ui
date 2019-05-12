import React, { Component } from "react";

export class FooterMenu extends Component {
  public render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu__item">
          Powered by <a href="//bzx.network">bZx</a>
        </div>
        <div className="footer-menu__item">
          <a href="//fulcrum.trade/tos/">Terms of use</a>
        </div>
        <div className="footer-menu__item">
          <a href="//fulcrum.trade/privacy/">Privacy policy</a>
        </div>
      </div>
    );
  }
}
