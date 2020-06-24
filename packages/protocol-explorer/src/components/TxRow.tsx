import React from "react";
import { ReactComponent as IconArrow } from "../assets/images/icon-tx-arrow.svg";
import { BigNumber } from "@0x/utils";

export interface ITxRowProps {
  hash: string,
  age: Date,
  account: string,
  quantity: BigNumber,
  action: string
}

export const TxRow = (props: ITxRowProps) => {
  return (
    <React.Fragment>
      <div className="table-row">
        <a href="#" className="table-row__hash">{props.hash}</a>
        <div className="table-row__age">{props.age.getHours()}</div>
        <a href="#" className="table-row__from">
          <IconArrow />
          <span className="table-row__from-address">{props.account}</span>
        </a>
        <div className="table-row__quantity">{props.quantity.toFixed(18)}</div>
        <div className="table-row__action">{props.action}</div>
      </div>
    </React.Fragment>
  );
}
