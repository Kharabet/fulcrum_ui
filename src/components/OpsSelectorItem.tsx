import React, { Component } from "react";
import { Link } from "react-router-dom";

export interface IOpsSelectorItemProps {
  operationName: string;
  operationImageSrc: any;
  operationAddress: string;
}

export class OpsSelectorItem extends Component<IOpsSelectorItemProps> {
  public render() {
    return (
      <div className="ops-selector-item">
        <Link to={this.props.operationAddress} className="ops-selector-item__link">
          <div className="ops-selector-item__content">
            <div className="ops-selector-item__image-container">
              <img src={this.props.operationImageSrc} alt={this.props.operationName} />
            </div>
            <div className="ops-selector-item__name">{this.props.operationName}</div>
            <div className="ops-selector-item__description">{this.props.children}</div>
          </div>
        </Link>
      </div>
    );
  }
}
