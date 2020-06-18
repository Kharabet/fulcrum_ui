import React from "react";
import { ReactComponent as IconArrow } from "../assets/images/icon-tx-arrow.svg";

export interface ITxRowProps {
  hash: string,
  age: number,
  account: string,
  quantity: string,
  action: string
}

export const TxRow = (props: ITxRowProps) => {
  return (
    <React.Fragment>
      <div className="table-row">
        <a href="#" className="table-row__hash">{props.hash}</a>
        <div className="table-row__age">{props.age}</div>
        <a href="#" className="table-row__from">
          <IconArrow />
          <span>{props.account}</span>
        </a>
        <div className="table-row__quantity">{props.quantity}</div>
        <div className="table-row__action">{props.action}</div>
      </div>
    </React.Fragment>
  );
}
