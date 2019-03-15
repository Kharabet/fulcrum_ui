import React, { Component } from "react";
import { Link } from "react-router-dom";

class FooterMenu extends Component {
  render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu__item">
          <Link to="/about-us">
            About us
          </Link>
        </div>
        <div className="footer-menu__item">
          <Link to="/faq">
            FAQ
          </Link>
        </div>
      </div>
    );
  }
}

export default FooterMenu;
