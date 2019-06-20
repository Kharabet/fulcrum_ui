import React, { Component, MouseEventHandler } from "react";

import ic_arrow_right from "../assets/images/ic_arrow_right.svg";

export enum ButtonLandingColor {
  Green = "button-landing--blue",
  Blue = "button-landing--green"
}

export interface IButtonLandingProps {
  title: string;
  subtitle: string;
  color: ButtonLandingColor;

  onClick?: MouseEventHandler<HTMLDivElement>;
}

export class ButtonLanding extends Component<IButtonLandingProps> {
  public render() {
    return (
      <div className={`btn button-landing ${this.props.color}`} onClick={this.props.onClick}>
        <div className="button-landing__titles">
          <div className="button-landing__subtitle">{this.props.subtitle}</div>
          <div className="button-landing__title">{this.props.title}</div>
        </div>
        <div className="button-landing__icon">
          <img src={ic_arrow_right} alt="" />
        </div>
      </div>
    );
  }
}
