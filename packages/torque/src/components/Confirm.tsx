import React, { FunctionComponent } from "react";

interface IConfirmProps {
  onConfirm: () => void;
  onDecline: () => void;
}

export const Confirm: FunctionComponent<IConfirmProps> = (props) =>
  <div className="confirm-wrapper">
    <div className="confirm" >
      <div className="dialog-header">
        <div className="dialog-header__title">Confirm</div>
      </div>
      <div className="dialog-content">
        {props.children}
      </div>
      <div className="dialog-actions">
        <button className="btn" type="submit" onClick={props.onConfirm}>Ok</button>
        <button className="btn btn-light" type="submit" onClick={props.onDecline}>Cancel</button>
      </div>
    </div>
  </div>
