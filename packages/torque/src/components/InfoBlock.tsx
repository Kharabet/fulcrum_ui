import React, { Component } from "react";

export interface IInfoBlockProps {
  localstorageItemProp: string;
  onAccept?: () => void;
}
export interface IInfoBlockState {
  isLocalstorageItemAccepted: boolean
}

export class InfoBlock extends Component<IInfoBlockProps, IInfoBlockState> {

  constructor(props: IInfoBlockProps, context?: any) {
    super(props, context);

    const localStorageItem = localStorage.getItem(this.props.localstorageItemProp)

    this.state = {
      isLocalstorageItemAccepted: localStorageItem && localStorageItem.length > 0 ? true : false
    }
  }
  onAccept = () => {
    localStorage.setItem(this.props.localstorageItemProp, "true");
    this.setState({ ...this.state, isLocalstorageItemAccepted: true });
    if (this.props.onAccept)
      this.props.onAccept();
  }

  public render() {
    if (this.state.isLocalstorageItemAccepted) { return null; }

    return (
      <div className="info-block__container">
        <div className="info-block__left">Please note:</div>
        <div className="info-block__center">{this.props.children}</div>
        <div className="info-block__right">
          <button className="info-block__accept" onClick={this.onAccept}>OK</button>
        </div>
      </div>
    );
  }
}
