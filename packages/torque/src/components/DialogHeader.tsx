import React, { PureComponent } from "react";

import {ReactComponent as ClosePopup } from "./../assets/images/ic_close_popup.svg"

export interface IDialogHeaderProps {
  title: string;

  onDecline: () => void;
}

export class DialogHeader extends PureComponent<IDialogHeaderProps> {
  public render() {
    return (
      <div className="dialog-header">
        <div className="dialog-header__title">{this.props.title}</div>
        <div className="dialog-header__title-close"onClick={this.props.onDecline}>
          <ClosePopup />
        </div>
      </div>
    );
  }
}
