import React, { Component } from "react";
import { Link } from "react-router-dom";

interface IOpsSelectorItemParams {
  operationName: string;
  operationImageSrc: any;
  operationAddress: string;
}

class OpsSelectorItem extends Component<IOpsSelectorItemParams> {
  render() {
    return (
      <div className="ops-selector-item">
        <Link to={this.props.operationAddress}>
          <div className="ops-selector-item__image"><img src={this.props.operationImageSrc} alt={this.props.operationName}/></div>
          <div className="ops-selector-item__name">{this.props.operationName}</div>
          <div className="ops-selector-item__description">{this.props.children}</div>
        </Link>
      </div>
    );
  }
}

export default OpsSelectorItem;
