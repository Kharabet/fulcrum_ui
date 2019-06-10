import React, { Component } from "react";

export class FooterMenu extends Component {
  public render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu__item">
          <a href="https://fulcrum.trade/tos/">Terms of use</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://fulcrum.trade/privacy/">Privacy policy</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://bzx.network/faq-fulcrum.html">FAQ</a>
        </div>
      </div>
    );
  }
}
