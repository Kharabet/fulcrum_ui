import React, { Component } from "react";

import ic_close from "../assets/images/ic_close.svg";
import ic_menu from "../assets/images/ic_menu.svg";

export interface IHeaderMenuToggleProps {
  isMenuOpen: boolean;
  onMenuToggle: (value: boolean) => void;
}

export class HeaderMenuToggle extends Component<IHeaderMenuToggleProps> {
  public render() {
    const toggleImg = !this.props.isMenuOpen ? ic_menu : ic_close;

    return (
      <div className="header-menu-toggle" onClick={this.onClick}>
        <img src={toggleImg} />
      </div>
    );
  }

  private onClick = () => {
    this.props.onMenuToggle(!this.props.isMenuOpen);
  };
}
