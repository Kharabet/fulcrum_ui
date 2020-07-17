import React from "react";
import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";
import { ExplorerProvider } from "../services/ExplorerProvider";

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
  const onLiquidateClick = async () => {
    const loanId = props.loanId;
    const decimals: number = AssetsDictionary.assets.get(props.loanToken)!.decimals || 18;

    const amountInBaseUnits = new BigNumber(props.payOffAmount.multipliedBy(10 ** decimals).toFixed(0, 1));
    const result = await ExplorerProvider.Instance.liquidate(loanId, amountInBaseUnits, props.loanToken);
    console.log(result)
  }
  const getShortHash = (hash: string, count: number) => {
    return hash.substring(0, 8) + '...' + hash.substring(hash.length - count);
  }
  return (
    <React.Fragment>
      <div className="table-row table-row-loan">
        <div className="table-row-loan__id">{getShortHash(props.loanId, 50)}</div>
        <div title={props.payOffAmount.toFixed(18)} className="table-row-loan__amount">{loanToken.logoSvg.render()} {props.payOffAmount.toFixed(3)}</div>
        <div title={props.seizeAmount.toFixed(18)} className="table-row-loan__collateral">{collateralToken.logoSvg.render()}{props.seizeAmount.toFixed(3)}</div>
        <div className="table-row-loan__action"><button className="action" onClick={onLiquidateClick}>Liquidate</button></div>
      </div>
    </React.Fragment>
  );
}
