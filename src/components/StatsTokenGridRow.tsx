import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ReserveDetails } from "../domain/ReserveDetails";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { FulcrumProvider } from "../services/FulcrumProvider";



export interface IStatsTokenGridRowProps {
  asset: Asset;
}

interface IStatsTokenGridRowState {
  assetDetails: AssetDetails | null;
  reserveDetails: ReserveDetails | null;
}

export class StatsTokenGridRow extends Component<IStatsTokenGridRowProps, IStatsTokenGridRowState> {
  constructor(props: IStatsTokenGridRowProps, context?: any) {
    super(props, context);

    this.state = {
      assetDetails: null,
      reserveDetails: null
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  private async derivedUpdate() {
    const assetDetails = await AssetsDictionary.assets.get(this.props.asset);
    const reserveDetails = await FulcrumProvider.Instance.getReserveDetails(this.props.asset);

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      reserveDetails: reserveDetails
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

  /*public componentDidUpdate(
    prevProps: Readonly<IStatsTokenGridRowProps>,
    prevState: Readonly<IStatsTokenGridRowState>,
    snapshot?: any
  ): void {

    if (prevProps.asset !== this.props.asset) {
      this.derivedUpdate();
    }
  }*/

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const details: ReserveDetails = this.state.reserveDetails ?  this.state.reserveDetails : ReserveDetails.getEmpty();

    return (
      <div className="stats-grid-row">
        {details.addressErc20 && 
          FulcrumProvider.Instance.web3ProviderSettings && 
          FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
          <a
            className="stats-grid-row__col-name"
            style={{cursor: `pointer`, textDecoration: `underline`}}
            title={details.addressErc20}
            href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}token/${details.addressErc20}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {this.props.asset}
          </a>
        ) : (
          <div className="stats-grid-row__col-name">{this.props.asset}</div>
        )}
        <div title={details.liquidity ? `${details.liquidity.toFixed(18)}` : ``} className="stats-grid-row__col-liquidity">{details.liquidity ? `${details.liquidity.toFixed(4)}` : `-`}</div>
        <div title={details.liquidityReserved ? `${details.liquidityReserved.toFixed(18)}` : ``} className="stats-grid-row__col-liquidity-reserved">{details.liquidityReserved ? `${details.liquidityReserved.toFixed(4)}` : `-`}</div>        
        <div title={details.totalSupply ? `${details.totalSupply.toFixed(18)}` : ``} className="stats-grid-row__col-total-supply">{details.totalSupply ? `${details.totalSupply.toFixed(4)}` : `-`}</div>
        <div title={details.totalBorrow ? `${details.totalBorrow.toFixed(18)}` : ``} className="stats-grid-row__col-total-borrow">{details.totalBorrow ? `${details.totalBorrow.toFixed(4)}` : `-`}</div>
        <div title={details.supplyInterestRate ? `${details.supplyInterestRate.toFixed(18)}` : ``} className="stats-grid-row__col-supply-rate">{details.supplyInterestRate ? `${details.supplyInterestRate.toFixed(4)}%` : `-`}</div>
        <div title={details.borrowInterestRate ? `${details.borrowInterestRate.toFixed(18)}` : ``} className="stats-grid-row__col-borrow-rate">{details.borrowInterestRate ? `${details.borrowInterestRate.toFixed(4)}%` : `-`}</div>
        <div title={details.nextInterestRate ? `${details.nextInterestRate.toFixed(18)}` : ``} className="stats-grid-row__col-next-rate">{details.nextInterestRate ? `${details.nextInterestRate.toFixed(4)}%` : `-`}</div>
      </div>
    );
  }
}
