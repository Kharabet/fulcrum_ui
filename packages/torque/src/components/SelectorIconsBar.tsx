import React, { Component } from "react";
import ic_arrow_right from "../assets/images/ic_arrow_right.svg";

export class SelectorIconsBar extends Component {
  public render() {
    return (
      <div className="selector-icons-bar">
        <img className="selector-icons-bar__item selector-icons-bar__icon" src={ic_arrow_right} />
        {this.props.children}
      </div>
    );
  }
}
