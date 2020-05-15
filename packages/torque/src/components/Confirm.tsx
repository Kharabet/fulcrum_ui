import React from "react";

interface IConfirmProps {
  amountDust: string;
  onConfirm: () => void;
  onDecline: () => void;
}

export function Confirm(props: IConfirmProps) {
  return (
    <React.Fragment>
      <div className="confirm-wrapper">
        <div className="confirm" >
          <div className="dialog-header">
            <div className="dialog-header__title">{`${window.location.host} says`}</div>
          </div>
          <div className="dialog-content">
            <p>Remaining debt should be zero or more than {props.amountDust} DAI. Do you want to continue with total amount?</p>
          </div>
          <div className="dialog-actions">
            <button className="btn" type="submit" onClick={props.onConfirm}>Ok</button>
            <button className="btn btn-light" type="submit" onClick={props.onDecline}>Cancel</button>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}