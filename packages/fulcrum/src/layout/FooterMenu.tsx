import React, { Component } from "react";
import { Link } from "react-router-dom";

interface IFooterMenuProps {
  isMobileMedia: boolean;
}

export class FooterMenu extends Component<IFooterMenuProps> {
  public render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu__item">
          <a href="https://fulcrum.trade/tos/">Terms of use</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://fulcrum.trade/privacy/">Privacy policy</a>
        </div>
        {!this.props.isMobileMedia ?
          <React.Fragment>
            <div className="footer-menu__item">
              <a href="https://bzx.network/faq-fulcrum.html">FAQ</a>
            </div>
            <div className="footer-menu__item">
              <Link to="/stats">
                Stats
              </Link>
            </div>
          </React.Fragment>
          : null}
      </div>
    );
  }
}
