import React, { Component, MouseEventHandler } from "react";

import ic_arrow_right from "../assets/images/ic_arrow_right.svg";

export enum ButtonLandingColor {
  Green,
  Blue
}

export interface IButtonLandingProps {
  title: string;
  subtitle: string;
  color: ButtonLandingColor;

  onClick?: MouseEventHandler<HTMLDivElement>;
}

export class ButtonLanding extends Component<IButtonLandingProps> {
  public render() {
    const buttonLandingContainerColorStyle =
      this.props.color === ButtonLandingColor.Green
        ? "button-landing-container--green"
        : "button-landing-container--blue";

    const buttonLandingColorStyle =
      this.props.color === ButtonLandingColor.Green
        ? "button-landing--green"
        : "button-landing--blue";

    return (
      <div className={`button-landing-container ${buttonLandingContainerColorStyle}`}>
        <div className={`btn button-landing ${buttonLandingColorStyle}`} onClick={this.props.onClick}>
          <div className="button-landing__titles">
            <div className="button-landing__subtitle">{this.props.subtitle}</div>
            <div className="button-landing__title">{this.props.title}</div>
          </div>
          <div className="button-landing__icon">
            <img src={ic_arrow_right} alt="" />
          </div>
        </div>
      </div>
    );
  }
}
