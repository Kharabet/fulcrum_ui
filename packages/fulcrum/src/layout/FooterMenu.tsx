import React, { Component } from "react";
import { Link } from "react-router-dom";

export class FooterMenu extends Component {
  public render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu__item">
          <a href="//fulcrum.trade/tos/">Terms of use</a>
        </div>
        <div className="footer-menu__item">
          <a href="//fulcrum.trade/privacy/">Privacy policy</a>
        </div>
        <Link className="footer-menu__item" to="/stats">
          Stats
        </Link>
      </div>
    );
  }
}
