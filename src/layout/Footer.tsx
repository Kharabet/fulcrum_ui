import React, { Component } from "react";
import FooterMenu from "./FooterMenu";

class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <FooterMenu/>
        <div>Powered by <a href="http://bzx.network/">bZx</a></div>
      </div>
    );
  }
}

export default Footer;
