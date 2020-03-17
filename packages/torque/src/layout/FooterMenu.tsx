import React, { Component } from "react";

interface IFooterMenuProps {
  isRiskDisclosureModalOpen: () => void;
}

export class FooterMenu extends Component<IFooterMenuProps> {
  public render() {
    return (
      <div className="footer-menu">
      <div className="footer-menu__item">
        <a href="https://help.bzx.network/en/collections/2008807-torque">Help Center</a>
      </div>
        <div className="footer-menu__item">
          <a href="https://torque.loans/tos/">Terms of use</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://torque.loans/privacy/">Privacy policy</a>
        </div>
        <div className="footer-menu__item">
          <button onClick={this.props.isRiskDisclosureModalOpen}>Risk Disclosure</button>
        </div>
        <div className="footer-menu__item">
          <a href="https://fulcrum.trade">Lending &amp; Trading</a>
        </div>
      </div>
    );
  }
}
