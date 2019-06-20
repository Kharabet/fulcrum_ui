import React, { PureComponent } from "react";

import ic_close_popup from "./../assets/images/ic_close_popup.svg"

export interface IDialogHeaderProps {
  title: string;

  onDecline: () => void;
}

export class DialogHeader extends PureComponent<IDialogHeaderProps> {
  public render() {
    return (
      <div className="dialog-header">
        <div className="dialog-header__title">{this.props.title}</div>
        <img className="dialog-header__title-close" src={ic_close_popup} onClick={this.props.onDecline} />
      </div>
    );
  }
}
