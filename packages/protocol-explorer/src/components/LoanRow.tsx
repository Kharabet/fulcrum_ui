import React from "react";
import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";

export interface ILoanRowProps {
  loanId: string,
  payOffAmount: BigNumber,
  seizeAmount: BigNumber,
  loanToken: Asset,
  collateralToken: Asset
}

export const LoanRow = (props: ILoanRowProps) => {
  const loanToken = AssetsDictionary.assets.get(props.loanToken) as AssetDetails;
  const collateralToken = AssetsDictionary.assets.get(props.collateralToken) as AssetDetails;

  return (
    <React.Fragment>
      <div className="table-row table-row-loan">
        <a className="table-row-loan__id">{props.loanId}</a>
        <div className="table-row-loan__amount">{loanToken.logoSvg.render()} {props.payOffAmount.toFixed(3)}</div>
        <div className="table-row-loan__collateral">{collateralToken.logoSvg.render()}{props.seizeAmount.toFixed(3)}</div>
        <div className="table-row-loan__action"><button className="action">Liquidate</button></div>
      </div>
    </React.Fragment>
  );
}
