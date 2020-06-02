import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";

import { Preloader } from "./Preloader";
import { ReactComponent as OpenManageCollateral } from "../assets/images/openManageCollateral.svg";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";

import "../styles/components/inner-own-token-card-mobile.scss";
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";

export interface IInnerOwnTokenCardMobileProps {
  loan: IBorrowedFundsState;
  currentKey: TradeTokenKey;
  onTrade: (request: TradeRequest) => void;
  onManageCollateralOpen: (request: ManageCollateralRequest) => void;
}

interface IInnerOwnTokenCardMobileState {
  assetDetails: AssetDetails | null;

  latestAssetPriceDataPoint: IPriceDataPoint;
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  isLoading: boolean;
}

export class InnerOwnTokenCardMobile extends Component<IInnerOwnTokenCardMobileProps, IInnerOwnTokenCardMobileState> {
  constructor(props: IInnerOwnTokenCardMobileProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.currentKey.asset);

    this._isMounted = false;

    this.state = {
      assetDetails: assetDetails || null,
      latestAssetPriceDataPoint: FulcrumProvider.Instance.getPriceDefaultDataPoint(),
      assetBalance: new BigNumber(0),
      profit: new BigNumber(0),
      isLoading: true
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private async derivedUpdate() {
    const tradeTokenKey = this.props.currentKey;
    const latestAssetPriceDataPoint = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(tradeTokenKey);

    const data: [BigNumber | null, BigNumber | null] = await FulcrumProvider.Instance.getTradeBalanceAndProfit(tradeTokenKey);
    const assetBalance = data[0];
    const profit = data[1];

    this._isMounted && this.setState(p => ({
      ...this.state,
      latestAssetPriceDataPoint: latestAssetPriceDataPoint,
      assetBalance: assetBalance,
      profit: profit,
      isLoading: latestAssetPriceDataPoint.price !== 0 ? false : p.isLoading
    }));
  }

  private onProviderAvailable = async () => {
    await this.derivedUpdate();
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    if (event.key.toString() === this.props.currentKey.toString()) {
      await this.derivedUpdate();
    }
  };

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }
  private renderOwnTokenRow = (state: IInnerOwnTokenCardMobileState, props: IInnerOwnTokenCardMobileProps, bnPrice: BigNumber, bnLiquidationPrice: BigNumber): React.ReactFragment => {
    if (!state.assetDetails) return <React.Fragment></React.Fragment>;
    return (
      <React.Fragment>
        <div className="inner-own-token-card-mobile">
          <div className="inner-own-token-card-mobile__body-row">
            <div className="inner-own-token-card-mobile__col-token-name-full">
              <span className="inner-own-token-header">{`Position (${this.props.currentKey.asset}/DAI)`}</span>
              0.8884
            </div>
            <div title={props.currentKey.unitOfAccount} className="inner-own-token-card-mobile__col-asset-type">
              <span className="position-type-marker">{`${props.currentKey.leverage}x`}&nbsp; {props.currentKey.positionType}</span>
            </div>
            <div className="inner-own-token-card-mobile__col-action">
              <button className="inner-own-token-card-mobile_button inner-own-token-card-mobile__sell-button inner-own-token-card-mobile__button--size-half" onClick={this.onSellClick}>
                {TradeType.SELL}
              </button>
            </div>
          </div>
          <div className="inner-own-token-card-mobile__body-row">
            <div title={`$${bnPrice.toFixed(18)}`} className="inner-own-token-card-mobile__col-asset-price">
              <span className="inner-own-token-header">Value</span>
              {!state.isLoading
                ? <React.Fragment>
                  <span className="sign-currency">$</span>{bnPrice.toFixed(2)}
                  <span className="inner-own-token-card-mobile__col-asset-price-small">12.25%</span>
                </React.Fragment>
                : <Preloader width="74px" />
              }
            </div>
            <div className="inner-own-token-card-mobile__col-asset-collateral">
              <span className="inner-own-token-header">Collateral</span>
              <React.Fragment>
                <span className="sign-currency">$</span>15.25
                <span className="inner-own-token-card-mobile__col-asset-collateral-small">16.5%</span>
              </React.Fragment>
              <div className="inner-own-token-card-mobile__open-manage-collateral" onClick={this.onManageClick}>
                <OpenManageCollateral />
              </div>
            </div>
          </div>
          <div className="inner-own-token-card-mobile__body-row">
            <div title={state.assetBalance ? `$${state.assetBalance.toFixed(18)}` : ``} className="inner-own-token-card-mobile__col-position-value">
              <span className="inner-own-token-header">Open Price</span>
              {!state.isLoading
                ? state.assetBalance
                  ? <React.Fragment><span className="sign-currency">$</span>{state.assetBalance.toFixed(2)}</React.Fragment>
                  : '$0.00'
                : <Preloader width="74px" />
              }
            </div>
            <div title={`$${bnLiquidationPrice.toFixed(18)}`} className="inner-own-token-card-mobile__col-liquidation-price">
              <span className="inner-own-token-header">Liquidation Price</span>
              {!state.isLoading
                ? <React.Fragment><span className="sign-currency">$</span>{bnLiquidationPrice.toFixed(2)}</React.Fragment>
                : <Preloader width="74px" />
              }
            </div>
            <div title={state.profit ? `$${state.profit.toFixed(18)}` : ``} className="inner-own-token-card-mobile__col-profit">
              <span className="inner-own-token-header">Pofit</span>
              {!state.isLoading ?
                state.profit
                  ? <React.Fragment><span className="sign-currency">$</span>{state.profit.toFixed(2)}</React.Fragment>
                  : '$0.00'
                : <Preloader width="74px" />
              }
            </div>
          </div>
        </div>
      </React.Fragment>
    );

  }

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const bnPrice = new BigNumber(this.state.latestAssetPriceDataPoint.price);
    const bnLiquidationPrice = new BigNumber(this.state.latestAssetPriceDataPoint.liquidationPrice);
    return this.renderOwnTokenRow(this.state, this.props, bnPrice, bnLiquidationPrice);
  }

  public onDetailsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
  };

  public onManageClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onManageCollateralOpen(
      new ManageCollateralRequest(
        new BigNumber(0),
        TradeType.BUY,
        this.props.currentKey.asset,
        this.props.currentKey.unitOfAccount,
        this.props.currentKey.positionType === PositionType.SHORT ? this.props.currentKey.asset : Asset.USDC,
        this.props.currentKey.positionType,
        this.props.currentKey.leverage,
        new BigNumber(0),
        this.props.currentKey.isTokenized,
        this.props.currentKey.version
      )
    );
  };

  public onSellClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onTrade(
      new TradeRequest(
        this.props.loan.loanId,
        TradeType.SELL,
        this.props.loan.loanAsset,
        Asset.UNKNOWN,
        this.props.loan.collateralAsset,
        this.props.loan.collateralAsset === Asset.ETH 
        ? PositionType.LONG 
        : PositionType.SHORT,
        this.props.currentKey.leverage,
        new BigNumber(0)
      )
    );
  };
}