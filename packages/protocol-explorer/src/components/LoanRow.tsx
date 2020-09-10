import React, { useState, useEffect } from 'react';
import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";
import { ExplorerProvider } from "../services/ExplorerProvider";
import { CircleLoader } from "./CircleLoader";
import { TxLoaderStep } from "./TxLoaderStep";

export interface ILoanRowProps {
  loanId: string;
  payOffAmount: BigNumber;
  seizeAmount: BigNumber;
  loanToken: Asset;
  collateralToken: Asset;
  onLiquidationCompleted: () => void;
}


export interface ILoanRow {
  isLoadingTransaction: boolean;
}

export const LoanRow = (props: ILoanRowProps) => {

  const loanToken = AssetsDictionary.assets.get(props.loanToken) as AssetDetails;
  const collateralToken = AssetsDictionary.assets.get(props.collateralToken) as AssetDetails;

  const [isLoadingTransaction, setLoadingTransaction] = useState(false);



  const onLiquidateClick = async () => {
    setLoadingTransaction(true);
    const loanId = props.loanId;
    const decimals: number = AssetsDictionary.assets.get(props.loanToken)!.decimals || 18;

    const amountInBaseUnits = new BigNumber(props.payOffAmount.multipliedBy(10 ** decimals).toFixed(0, 1));
    const result = await ExplorerProvider.Instance.liquidate(loanId, amountInBaseUnits, props.loanToken);
    console.log(result);
    props.onLiquidationCompleted();
  }

  const getShortHash = (hash: string, count: number) => {
    return hash.substring(0, 8) + '...' + hash.substring(hash.length - count);
  }

  return (
    <React.Fragment>

      {isLoadingTransaction ?
        <div className="table-row__image">
          <TxLoaderStep taskId={props.loanId} />
          <CircleLoader></CircleLoader>
        </div> :
        <div className="table-row table-row-loan">
          <div title={props.loanId} className="table-row-loan__id">{getShortHash(props.loanId, 45)}</div>
          <div title={props.payOffAmount.toFixed(18)} className="table-row-loan__amount">{loanToken.logoSvg.render()} {props.payOffAmount.toFixed(3)}</div>
          <div title={props.seizeAmount.toFixed(18)} className="table-row-loan__collateral">{collateralToken.logoSvg.render()}{props.seizeAmount.toFixed(3)}</div>
          <div className="table-row-loan__action"><button className="action" onClick={onLiquidateClick}>Liquidate</button></div>
        </div>
      }
    </React.Fragment>
  );
}
