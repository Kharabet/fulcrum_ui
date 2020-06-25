import React from "react";
import { ReactComponent as IconArrow } from "../assets/images/icon-tx-arrow.svg";
import { BigNumber } from "@0x/utils";

export interface ITxRowProps {
  hash: string,
  etherscanTxUrl: string,
  age: Date,
  account: string,
  etherscanAddressUrl: string,
  quantity: BigNumber,
  action: string
}

export const TxRow = (props: ITxRowProps) => {
  const timeSince = (date: Date) => {

    var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  
    var interval = Math.floor(seconds / 31536000);
  
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
  return (
    <React.Fragment>
      <div className="table-row">
        <a href={props.etherscanTxUrl} className="table-row__hash">{props.hash}</a>
        <div className="table-row__age">{timeSince(props.age)}</div>
        <a href={props.etherscanAddressUrl} className="table-row__from">
          <IconArrow />
          <span className="table-row__from-address">{props.account}</span>
        </a>
        <div className="table-row__quantity">{props.quantity.toFixed(18)}</div>
        <div className="table-row__action">{props.action}</div>
      </div>
    </React.Fragment>
  );
}
