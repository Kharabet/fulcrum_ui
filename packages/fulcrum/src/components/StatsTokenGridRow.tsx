import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import { Asset } from '../domain/Asset'
import { AssetDetails } from '../domain/AssetDetails'
import { AssetsDictionary } from '../domain/AssetsDictionary'
import { ReserveDetails } from '../domain/ReserveDetails'
import { FulcrumProviderEvents } from '../services/events/FulcrumProviderEvents'
import { FulcrumProvider } from '../services/FulcrumProvider'

export interface IStatsTokenGridRowProps {
  reserveDetails: ReserveDetails
  yieldApr: BigNumber
}

interface IStatsTokenGridRowState {
  assetDetails: AssetDetails | null
  usdSupply: BigNumber | null
  usdTotalLocked: BigNumber | null
  decimals: number
}

export class StatsTokenGridRow extends Component<IStatsTokenGridRowProps, IStatsTokenGridRowState> {
  constructor(props: IStatsTokenGridRowProps, context?: any) {
    super(props, context)

    this.state = {
      assetDetails: null,
      usdSupply: null,
      usdTotalLocked: null,
      decimals: 18
    }

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )

    FulcrumProvider.Instance.eventEmitter.on(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  private async derivedUpdate() {
    const assetDetails = await AssetsDictionary.assets.get(this.props.reserveDetails.asset!)

    this.setState({
      ...this.state,
      assetDetails: assetDetails || null
    })
  }

  private onProviderAvailable = () => {
    this.derivedUpdate()
  }

  private onProviderChanged = () => {
    this.derivedUpdate()
  }

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(
      FulcrumProviderEvents.ProviderAvailable,
      this.onProviderAvailable
    )
    FulcrumProvider.Instance.eventEmitter.removeListener(
      FulcrumProviderEvents.ProviderChanged,
      this.onProviderChanged
    )
  }

  public componentDidMount(): void {
    this.derivedUpdate()
  }

  private numberWithCommas(numberStr: string): string {
    const parts = numberStr.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts.join('.')
  }

  public render() {
    const details = this.props.reserveDetails

    if (this.props.reserveDetails.asset === Asset.UNKNOWN) {
      return (
        <div className="stats-grid-row">
          <div className="stats-grid-row__col stats-grid-row__col-name">
            <span className="fw-800 color-primary stats-grid-row__asset-name reserve-all">
              All <span>&nbsp;reserve</span>
            </span>
          </div>
          <div
            title={details.usdTotalLocked ? `$${details.usdTotalLocked.toFixed(18)}` : ``}
            className="stats-grid-row__col stats-grid-row__col-total-tvl-usd">
            {details.usdTotalLocked ? (
              <React.Fragment>
                $
                <span className="fw-800 color-primary">
                  {this.numberWithCommas(details.usdTotalLocked.toFixed(2))}
                </span>
              </React.Fragment>
            ) : (
              `-`
            )}
          </div>
          <div
            title={details.totalSupply ? `${details.totalSupply.toFixed(this.state.decimals)}` : ``}
            className="stats-grid-row__col stats-grid-row__col-total-supply-usd">
            {details.usdSupply ? (
              <React.Fragment>
                $
                <span className="fw-800 color-primary">
                  {this.numberWithCommas(details.usdSupply.toFixed(2))}
                </span>
              </React.Fragment>
            ) : (
              `-`
            )}
          </div>
          <div className="stats-grid-row__col stats-grid-row__col-total-supply"></div>
          <div className="stats-grid-row__col stats-grid-row__col-total-borrow"></div>
          <div className="stats-grid-row__col stats-grid-row__col-total-borrow"></div>
          <div className="stats-grid-row__col stats-grid-row__col-liquidity"></div>
          <div className="stats-grid-row__col stats-grid-row__col-supply-rate"></div>
          <div className="stats-grid-row__col stats-grid-row__col-borrow-rate"></div>
        </div>
      )
    }

    if (!this.state.assetDetails) {
      return null
    }

    let customBorrowTitle
    let customBorrowText
    if (
      details.borrowInterestRate &&
      this.props.yieldApr.gt(0) &&
      this.props.reserveDetails.asset! !== Asset.ETHv1
    ) {
      customBorrowTitle = `${details.borrowInterestRate.toFixed(
        18
      )}% / ${this.props.yieldApr.toFixed(18)}%`
      customBorrowText = (
        <React.Fragment>
          <span className="fw-800 color-primary">{details.borrowInterestRate.toFixed(2)}</span>
          %&nbsp;/&nbsp;
          <span className="fw-800 color-primary">{this.props.yieldApr.toFixed(0)}</span>%
        </React.Fragment>
      )
    } else {
      customBorrowTitle = ``
      customBorrowText = `-`
    }

    return (
      <div className="stats-grid-row">
        {details.addressErc20 &&
        FulcrumProvider.Instance.web3ProviderSettings &&
        FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
          <a
            className="stats-grid-row__col stats-grid-row__col-name"
            style={{ cursor: `pointer` }}
            title={details.addressErc20}
            href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${details.addressErc20}#readContract`}
            target="_blank"
            rel="noopener noreferrer">
            <div className="stats-grid-row__image">
              {this.state.assetDetails.reactLogoSvg.render()}
            </div>
            <span className="stats-grid-row__asset-name fw-800 color-primary">
              {details.asset!}
            </span>
          </a>
        ) : (
          <div className="stats-grid-row__col stats-grid-row__col-name">
            <div className="stats-grid-row__image">
              {this.state.assetDetails.reactLogoSvg.render()}
            </div>
            <span className="stats-grid-row__asset-name fw-800 color-primary">
              {details.asset!}
            </span>
          </div>
        )}
        <div
          title={details.usdTotalLocked ? `$${details.usdTotalLocked.toFixed(18)}` : ``}
          className="stats-grid-row__col stats-grid-row__col-total-tvl-usd">
          {details.usdTotalLocked ? (
            <React.Fragment>
              $
              <span className="fw-800 color-primary">
                {this.numberWithCommas(details.usdTotalLocked.toFixed(2))}
              </span>
            </React.Fragment>
          ) : (
            `-`
          )}
        </div>
        <div
          title={details.usdSupply ? `$${details.usdSupply.toFixed(18)}` : ``}
          className="stats-grid-row__col stats-grid-row__col-total-supply-usd">
          {details.usdSupply ? (
            <React.Fragment>
              $
              <span className="fw-800 color-primary">
                {this.numberWithCommas(details.usdSupply.toFixed(2))}
              </span>
            </React.Fragment>
          ) : (
            `-`
          )}
        </div>
        <div
          title={details.totalSupply ? `${details.totalSupply.toFixed(this.state.decimals)}` : ``}
          className="stats-grid-row__col stats-grid-row__col-total-supply">
          {details.totalSupply ? (
            <span className="fw-800 color-primary">
              {this.numberWithCommas(details.totalSupply.toFixed(2))}
            </span>
          ) : (
            `-`
          )}
        </div>
        <div
          title={details.totalBorrow ? `${details.totalBorrow.toFixed(this.state.decimals)}` : ``}
          className="stats-grid-row__col stats-grid-row__col-total-borrow">
          {details.totalBorrow ? (
            <span className="fw-800 color-primary">
              {this.numberWithCommas(details.totalBorrow.toFixed(2))}
            </span>
          ) : (
            `-`
          )}
        </div>
        <div
          title={details.lockedAssets ? `${details.lockedAssets.toFixed(this.state.decimals)}` : ``}
          className="stats-grid-row__col stats-grid-row__col-locked">
          {details.lockedAssets ? (
            <span className="fw-800 color-primary">
              {this.numberWithCommas(details.lockedAssets.toFixed(2))}
            </span>
          ) : (
            `-`
          )}
        </div>
        <div
          title={details.liquidity ? `${details.liquidity.toFixed(this.state.decimals)}` : ``}
          className="stats-grid-row__col stats-grid-row__col-liquidity">
          {details.liquidity ? (
            <span className="fw-800 color-primary">
              {this.numberWithCommas(details.liquidity.toFixed(2))}
            </span>
          ) : (
            `-`
          )}
        </div>
        <div
          title={details.supplyInterestRate ? `${details.supplyInterestRate.toFixed(18)}%` : ``}
          className="stats-grid-row__col stats-grid-row__col-supply-rate">
          {details.supplyInterestRate ? (
            <React.Fragment>
              <span className="fw-800 color-primary">{details.supplyInterestRate.toFixed(2)}</span>%
            </React.Fragment>
          ) : (
            `-`
          )}
        </div>
        <div
          title={customBorrowTitle}
          className="stats-grid-row__col stats-grid-row__col-borrow-rate">
          {customBorrowText}
        </div>
      </div>
    )
  }
}
