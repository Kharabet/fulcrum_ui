import React, { Component } from "react";
import ic_arrow_right from "../assets/images/ic_arrow_right.svg";

export class BorrowSelectorIconsBar extends Component {
  public render() {
    return (
      <div className="selector-icons-borrow-bar">
        <img className="selector-icons-borrow-bar__item selector-icons-borrow-bar__icon" src={ic_arrow_right} />
        {this.props.children}
      </div>
    );
  }
}
