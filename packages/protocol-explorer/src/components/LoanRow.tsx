import React from "react";
import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";

export interface ILoanRowProps {
  hash: string,
  etherscanTxUrl: string,
  age: Date,
  account: string,
  etherscanAddressUrl: string,
  quantity: BigNumber,
  action: string
}

export const LoanRow = (props: ILoanRowProps) => {
  const dai = AssetsDictionary.assets.get(Asset.DAI) as AssetDetails;
  const eth = AssetsDictionary.assets.get(Asset.ETH) as AssetDetails;

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
      <div className="table-row table-row-loan">
        <a href={props.etherscanTxUrl} className="table-row-loan__id">{props.account}</a>
        <div className="table-row-loan__amount">{dai.logoSvg.render()} {props.quantity.toFixed(3)}</div>
        <div className="table-row-loan__collateral">{eth.logoSvg.render()}{props.quantity.toFixed(3)}</div>
        <div className="table-row-loan__action"><button className="action">{props.action}</button></div>
      </div>
    </React.Fragment>
  );
}
