import React, { Component } from "react";

interface IFooterMenuProps {
  isRiskDisclosureModalOpen: () => void;
}

export class FooterMenu extends Component<IFooterMenuProps> {
  public onRiskOpen = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    this.props.isRiskDisclosureModalOpen()
  }
  public render() {
    return (
      <div className="footer-menu">
        <div className="footer-menu__item">
          <a href="https://torque.loans/tos/">Terms of use</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://torque.loans/privacy/">Privacy policy</a>
        </div>
        <div className="footer-menu__item">
          <a href="#" onClick={this.onRiskOpen.bind(this)}>Risk Disclosure</a>
        </div>
        <div className="footer-menu__item">
          <a href="https://fulcrum.trade">Lending &amp; Trading</a>
        </div>
      </div>
    );
  }
}
