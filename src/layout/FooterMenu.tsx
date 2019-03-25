import React, { Component } from "react";

class FooterMenu extends Component {
  public render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu__item">
          <a href="//bzx.network/#team">About us</a>
        </div>
        <div className="footer-menu__item">
          <a href="//bzx.network/faq.html">FAQ</a>
        </div>
      </div>
    );
  }
}

export default FooterMenu;
