import React, { Component } from "react";
import FooterMenu from "./FooterMenu";
import FooterPoweredBy from "./FooterPoweredBy";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <FooterMenu/>
        <FooterPoweredBy/>
      </div>
    );
  }
}

export default Footer;
