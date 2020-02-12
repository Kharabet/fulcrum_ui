import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ReserveDetails } from "../domain/ReserveDetails";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface IStatsTokenGridRowProps {
  reserveDetails: ReserveDetails;
}

interface IStatsTokenGridRowState {
  assetDetails: AssetDetails | null;
  usdSupply: BigNumber | null;
  usdTotalLocked: BigNumber | null;
  decimals: number;
}

export class StatsTokenGridRow extends Component<IStatsTokenGridRowProps, IStatsTokenGridRowState> {
  constructor(props: IStatsTokenGridRowProps, context?: any) {
    super(props, context);

    this.state = {
      assetDetails: null,
      usdSupply: null,
      usdTotalLocked: null,
      decimals: 18
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  private async derivedUpdate() {
    const assetDetails = await AssetsDictionary.assets.get(this.props.reserveDetails.asset!);

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
    });
  }

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  private numberWithCommas(numberStr: string): string {
    const parts = numberStr.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  public render() {
    const details = this.props.reserveDetails;

    if (this.props.reserveDetails.asset === Asset.UNKNOWN) {
      return (
        <div className="stats-grid-row">
          <div className="stats-grid-row__col-name">ALL</div>
          <div title={details.usdTotalLocked ? `$${details.usdTotalLocked.toFixed(18)}` : ``} className="stats-grid-row__col-total-tvl-usd">{details.usdTotalLocked ? `$${this.numberWithCommas(details.usdTotalLocked.toFixed(4))}` : `-`}</div>
          <div title={details.totalSupply ? `${details.totalSupply.toFixed(this.state.decimals)}` : ``} className="stats-grid-row__col-total-supply-usd">{details.usdSupply ? `$${this.numberWithCommas(details.usdSupply.toFixed(4))}` : `-`}</div>
          <div className="stats-grid-row__col-total-supply">-</div>
          <div className="stats-grid-row__col-total-borrow">-</div>
          <div className="stats-grid-row__col-total-borrow">-</div>
          <div className="stats-grid-row__col-liquidity">-</div>
          <div className="stats-grid-row__col-supply-rate">-</div>
          <div className="stats-grid-row__col-borrow-rate">-</div>
        </div>
      );
    }
    
    if (!this.state.assetDetails) {
      return null;
    }

    let customBorrowTitle;
    let customBorrowText;
    if (details.borrowInterestRate && details.torqueBorrowInterestRate) {
      customBorrowTitle = `${details.borrowInterestRate.toFixed(18)}% / ${details.torqueBorrowInterestRate.toFixed(18)}%`;
      customBorrowText = `${details.borrowInterestRate.toFixed(2)}% / ${details.torqueBorrowInterestRate.toFixed(2)}%`;
    } else {
      customBorrowTitle = ``;
      customBorrowText = `-`;
    }


    return (
      <div className="stats-grid-row">
        {details.addressErc20 &&
          FulcrumProvider.Instance.web3ProviderSettings &&
          FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
          <a
            className="stats-grid-row__col-name"
            style={{cursor: `pointer`, textDecoration: `underline`}}
            title={details.addressErc20}
            href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${details.addressErc20}#readContract`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {details.asset!}
          </a>
        ) : (
          <div className="stats-grid-row__col-name">{details.asset!}</div>
        )}
        <div title={details.usdTotalLocked ? `$${details.usdTotalLocked.toFixed(18)}` : ``} className="stats-grid-row__col-total-tvl-usd">{details.usdTotalLocked ? `$${this.numberWithCommas(details.usdTotalLocked.toFixed(4))}` : `-`}</div>
        <div title={details.usdSupply ? `$${details.usdSupply.toFixed(18)}` : ``} className="stats-grid-row__col-total-supply-usd">{details.usdSupply ? `$${this.numberWithCommas(details.usdSupply.toFixed(4))}` : `-`}</div>
        <div title={details.totalSupply ? `${details.totalSupply.toFixed(this.state.decimals)}` : ``} className="stats-grid-row__col-total-supply">{details.totalSupply ? `${this.numberWithCommas(details.totalSupply.toFixed(4))}` : `-`}</div>
        <div title={details.totalBorrow ? `${details.totalBorrow.toFixed(this.state.decimals)}` : ``} className="stats-grid-row__col-total-borrow">{details.totalBorrow ? `${this.numberWithCommas(details.totalBorrow.toFixed(4))}` : `-`}</div>
        <div title={details.lockedAssets ? `${details.lockedAssets.toFixed(this.state.decimals)}` : ``} className="stats-grid-row__col-total-borrow">{details.lockedAssets ? `${this.numberWithCommas(details.lockedAssets.toFixed(4))}` : `-`}</div>
        <div title={details.liquidity ? `${details.liquidity.toFixed(this.state.decimals)}` : ``} className="stats-grid-row__col-liquidity">{details.liquidity ? `${this.numberWithCommas(details.liquidity.toFixed(4))}` : `-`}</div>
        <div title={details.supplyInterestRate ? `${details.supplyInterestRate.toFixed(18)}%` : ``} className="stats-grid-row__col-supply-rate">{details.supplyInterestRate ? `${details.supplyInterestRate.toFixed(4)}%` : `-`}</div>
        <div title={customBorrowTitle} className="stats-grid-row__col-borrow-rate">{customBorrowText}</div>
        {/*<div title={details.borrowInterestRate ? `${details.borrowInterestRate.toFixed(18)}%` : ``} className="stats-grid-row__col-borrow-rate">{details.borrowInterestRate ? `${details.borrowInterestRate.toFixed(4)}%` : `-`}</div>*/}
      </div>
    );
  }
}
