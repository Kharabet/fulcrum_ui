import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ReserveDetails } from "../domain/ReserveDetails";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface IStatsTokenGridCardProps {
  asset: Asset;
}

interface IStatsTokenGridCardState {
  assetDetails: AssetDetails | null;
  reserveDetails: ReserveDetails;
  swapPrice: BigNumber | null;
  usdSupply: BigNumber | null;
  decimals: number;
}

export class StatsTokenGridCard extends Component<IStatsTokenGridCardProps, IStatsTokenGridCardState> {
  constructor(props: IStatsTokenGridCardProps, context?: any) {
    super(props, context);

    this.state = {
      assetDetails: null,
      reserveDetails: ReserveDetails.getEmpty(),
      swapPrice: null,
      usdSupply: null,
      decimals: 18
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
  }

  private async derivedUpdate() {
    const assetDetails = await AssetsDictionary.assets.get(this.props.asset);
    const swapPrice = await FulcrumProvider.Instance.getSwapToUsdRate(this.props.asset);
    const reserveDetails = await FulcrumProvider.Instance.getReserveDetails(this.props.asset);

    let decimals = 18;
    let usdSupply: BigNumber | null = null;
    if (assetDetails) {
      decimals = assetDetails.decimals;
      if (reserveDetails && reserveDetails.totalSupply) {
        const precision = new BigNumber(10 ** (18 - decimals));
        reserveDetails.totalSupply = reserveDetails.totalSupply!.times(precision);
        if (swapPrice) {
          usdSupply = reserveDetails.totalSupply!.times(swapPrice); // .div(10**(18-decimals));
        }

        reserveDetails.totalBorrow = reserveDetails.totalBorrow!.times(precision);
        reserveDetails.liquidity = reserveDetails.liquidity!.times(precision);
        reserveDetails.liquidityReserved = reserveDetails.liquidityReserved!.times(precision);
        reserveDetails.lockedAssets = reserveDetails.lockedAssets!.times(precision);
      }
    }

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null,
      reserveDetails: reserveDetails || ReserveDetails.getEmpty(),
      usdSupply: usdSupply,
      swapPrice: swapPrice,
      decimals
    });
  }

  private onProviderAvailable = () => {
    this.derivedUpdate();
  };

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(
      FulcrumProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    );
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  private numberWithCommas(numberStr: string): string {
    const parts = numberStr.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(".");
  }

  /*public componentDidUpdate(
    prevProps: Readonly<IStatsTokenGridCardProps>,
    prevState: Readonly<IStatsTokenGridCardState>,
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

    const details = this.state.reserveDetails;

    return (
      <div className="stats-grid-card">
        {this.renderAssetInfo(details)}

        <div className="stats-grid-card__details-container">
          <div className="stats-grid-card__kv-container">
            <div className="stats-grid-card__kv-title">
              <span className="">Total Supply (USD)</span>
            </div>
            <div className="stats-grid-card__kv-dots" />
            <div
              title={this.state.usdSupply ? `$${this.state.usdSupply.toFixed(18)}` : ``}
              className="stats-grid-card__kv-value"
            >
              {this.state.usdSupply ? `$${this.numberWithCommas(this.state.usdSupply.toFixed(4))}` : `-`}
            </div>
          </div>
          <div className="stats-grid-card__kv-container">
            <div className="stats-grid-card__kv-title">
              <span className="">Total Supply</span>
            </div>
            <div className="stats-grid-card__kv-dots" />
            <div
              title={details.totalSupply ? `${details.totalSupply.toFixed(this.state.decimals)}` : ``}
              className="stats-grid-card__kv-value"
            >
              {details.totalSupply ? `${this.numberWithCommas(details.totalSupply.toFixed(4))}` : `-`}
            </div>
          </div>
          <div className="stats-grid-card__kv-container">
            <div className="stats-grid-card__kv-title">
              <span className="">Total Borrow</span>
            </div>
            <div className="stats-grid-card__kv-dots" />
            <div
              title={details.totalBorrow ? `${details.totalBorrow.toFixed(this.state.decimals)}` : ``}
              className="stats-grid-card__kv-value"
            >
              {details.totalBorrow ? `${this.numberWithCommas(details.totalBorrow.toFixed(4))}` : `-`}
            </div>
          </div>
          <div className="stats-grid-card__kv-container">
            <div className="stats-grid-card__kv-title">
              <span className="">Vault Locked</span>
            </div>
            <div className="stats-grid-card__kv-dots" />
            <div
              title={details.lockedAssets ? `${details.lockedAssets.toFixed(this.state.decimals)}` : ``}
              className="stats-grid-card__kv-value"
            >
              {details.lockedAssets ? `${this.numberWithCommas(details.lockedAssets.toFixed(4))}` : `-`}
            </div>
          </div>
          <div className="stats-grid-card__kv-container">
            <div className="stats-grid-card__kv-title">
              <span className="">Free Liquidity</span>
            </div>
            <div className="stats-grid-card__kv-dots" />
            <div
              title={details.liquidity ? `${details.liquidity.toFixed(this.state.decimals)}` : ``}
              className="stats-grid-card__kv-value"
            >
              {details.liquidity ? `${this.numberWithCommas(details.liquidity.toFixed(4))}` : `-`}
            </div>
          </div>
          <div className="stats-grid-card__kv-container">
            <div className="stats-grid-card__kv-title">
              <span className="">Reserved Liquidity</span>
            </div>
            <div className="stats-grid-card__kv-dots" />
            <div
              title={details.liquidityReserved ? `${details.liquidityReserved.toFixed(this.state.decimals)}` : ``}
              className="stats-grid-card__kv-value"
            >
              {details.liquidityReserved ? `${this.numberWithCommas(details.liquidityReserved.toFixed(4))}` : `-`}
            </div>
          </div>
          <div className="stats-grid-card__kv-container">
            <div className="stats-grid-card__kv-title">
              <span className="">Supply Rate (APR)</span>
            </div>
            <div className="stats-grid-card__kv-dots" />
            <div
              title={details.supplyInterestRate ? `${details.supplyInterestRate.toFixed(18)}%` : ``}
              className="stats-grid-card__kv-value"
            >
              {details.supplyInterestRate ? `${details.supplyInterestRate.toFixed(4)}%` : `-`}
            </div>
          </div>
          <div className="stats-grid-card__kv-container">
            <div className="stats-grid-card__kv-title">
              <span className="">Borrow Rate (APR)</span>
            </div>
            <div className="stats-grid-card__kv-dots" />
            <div
              title={details.borrowInterestRate ? `${details.borrowInterestRate.toFixed(18)}%` : ``}
              className="stats-grid-card__kv-value"
            >
              {details.borrowInterestRate ? `${details.borrowInterestRate.toFixed(4)}%` : `-`}
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderAssetInfo(details: ReserveDetails) {
    if (!this.state.assetDetails) {
      return null;
    }

    return details.addressErc20 &&
      FulcrumProvider.Instance.web3ProviderSettings &&
      FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
      <a
        className="stats-grid-card__info-container-link"
        title={details.addressErc20}
        href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}token/${details.addressErc20}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="stats-grid-card__image">
          <img src={this.state.assetDetails.logoSvg} alt={this.state.assetDetails.displayName} />
        </div>
        <div className="stats-grid-row__col-name" style={{ textDecoration: `underline` }}>
          {this.props.asset}
        </div>
      </a>
    ) : (
      <div className="stats-grid-card__info-container">
        <div className="stats-grid-card__image">
          <img src={this.state.assetDetails.logoSvg} alt={this.state.assetDetails.displayName} />
        </div>
        <div className="stats-grid-row__col-name">{this.props.asset}</div>
      </div>
    );
  }
}
