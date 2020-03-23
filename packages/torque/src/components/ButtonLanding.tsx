import React, { Component, MouseEventHandler } from "react";
import { Link } from "react-router-dom";

import ic_arrow_right from "../assets/images/ic_arrow_right.svg";

export enum ButtonLandingColor {
  Green,
  Blue,
  Purple
}

export interface IButtonLandingProps {
  title: string;
  subtitle: string;
  color: ButtonLandingColor;
  url: string;
}

export class ButtonLanding extends Component<IButtonLandingProps> {
  public render() {
    const buttonLandingContainerColorStyle =
      this.props.color === ButtonLandingColor.Green
        ? "button-landing-container--green"
        : this.props.color === ButtonLandingColor.Purple ? "button-landing-container--purple" : "button-landing-container--blue";

    const buttonLandingColorStyle =
      this.props.color === ButtonLandingColor.Green
        ? "button-landing--green"
        : this.props.color === ButtonLandingColor.Purple ? "button-landing--purple": "button-landing--blue";

    return (
      <div className={`button-landing-container ${buttonLandingContainerColorStyle}`}>
        <Link className={`button-landing__link`} to={this.props.url}>
          <div className={`btn button-landing ${buttonLandingColorStyle}`}>
            <div className="button-landing__titles">
              <div className="button-landing__subtitle">{this.props.subtitle}</div>
              <div className="button-landing__title">{this.props.title}</div>
            </div>
            <div className="button-landing__icon">
              <img src={ic_arrow_right} alt="" />
            </div>
          </div>
        </Link>
      </div>
    );
  }
}
