import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
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
import { IBorrowedFundsState } from "../domain/IBorrowedFundsState";

export interface IInnerOwnTokenGridRowProps {
  loan: IBorrowedFundsState;
  currentKey: TradeTokenKey;
  pTokenAddress: string;
  onTrade: (request: TradeRequest) => void;
  onManageCollateralOpen: (request: ManageCollateralRequest) => void;
}

interface IInnerOwnTokenGridRowState {
  assetDetails: AssetDetails | null;

  latestAssetPriceDataPoint: IPriceDataPoint;
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  isLoading: boolean;
  priceOfUnitOfAccount: BigNumber;
  priceOfAsset: BigNumber;
}

export class InnerOwnTokenGridRow extends Component<IInnerOwnTokenGridRowProps, IInnerOwnTokenGridRowState> {
  constructor(props: IInnerOwnTokenGridRowProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.currentKey.asset);

    this._isMounted = false;

    this.state = {
      assetDetails: assetDetails || null,
      latestAssetPriceDataPoint: FulcrumProvider.Instance.getPriceDefaultDataPoint(),
      assetBalance: new BigNumber(0),
      profit: new BigNumber(0),
      isLoading: true,
      priceOfUnitOfAccount: new BigNumber(0),
      priceOfAsset: new BigNumber(0),
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private getTradeTokenGridRowSelectionKeyRaw(props: IInnerOwnTokenGridRowProps, leverage: number = this.props.currentKey.leverage) {
    return new TradeTokenKey(this.props.currentKey.asset, this.props.currentKey.unitOfAccount, this.props.currentKey.positionType, leverage, this.props.currentKey.isTokenized, this.props.currentKey.version);
  }

  private getTradeTokenGridRowSelectionKey(leverage: number = this.props.currentKey.leverage) {
    return this.getTradeTokenGridRowSelectionKeyRaw(this.props, leverage);
  }

  private async derivedUpdate() {
    const tradeTokenKey = this.props.currentKey;
    const latestAssetPriceDataPoint = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(tradeTokenKey);

    const data: [BigNumber | null, BigNumber | null] = await FulcrumProvider.Instance.getTradeBalanceAndProfit(tradeTokenKey);
    const assetBalance = data[0];
    const profit = data[1];
    let priceOfUnitOfAccount = await FulcrumProvider.Instance.getSwapToUsdRate(this.props.currentKey.unitOfAccount)
    let priceOfAsset = await FulcrumProvider.Instance.getSwapToUsdRate(this.props.currentKey.asset)

    this._isMounted && this.setState(p => ({
      ...this.state,
      latestAssetPriceDataPoint: latestAssetPriceDataPoint,
      assetBalance: assetBalance,
      profit: profit,
      isLoading: latestAssetPriceDataPoint.price !== 0 ? false : p.isLoading,
      priceOfUnitOfAccount,
      priceOfAsset
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

  public componentWillMount(): void {
    this.derivedUpdate();
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }

  /*public componentDidUpdate(
    prevProps: Readonly<IInnerOwnTokenGridRowProps>,
    prevState: Readonly<IInnerOwnTokenGridRowState>,
    snapshot?: any
  ): void {
    if (
      prevProps.currentKey.leverage !== this.props.currentKey.leverage ||
      (prevProps.selectedKey.toString() === prevProps.currentKey.toString()) !==
        (this.props.selectedKey.toString() === this.props.currentKey.toString())
    ) {
      this.derivedUpdate();
    }
  }*/
  private renderOwnTokenRow = (state: IInnerOwnTokenGridRowState, props: IInnerOwnTokenGridRowProps, bnPrice: BigNumber, bnLiquidationPrice: BigNumber): React.ReactFragment => {
    if (!state.assetDetails) return <React.Fragment></React.Fragment>;
    let position = new BigNumber(0);
    let value = new BigNumber(0);
    let collateral = new BigNumber(0);
    let openPrice = new BigNumber(0);
    const liquidationRate = ((new BigNumber("15000000000000000000").times(this.props.loan.loanData!.principal).div(10 ** 20)).plus(this.props.loan.loanData!.principal)).div(this.props.loan.loanData!.collateral)
    let liquidationPrice = new BigNumber(0);
    let profit = new BigNumber(0);
    if (this.props.currentKey.positionType === PositionType.LONG) {
      position = this.props.loan.loanData!.collateral.div(10 ** 18);
      value = this.props.loan.loanData!.collateral.div(10 ** 18).times(this.state.priceOfAsset);
      collateral = ((this.props.loan.loanData!.collateral.times(this.state.priceOfAsset).div(10 ** 18)).minus(this.props.loan.loanData!.principal.times(this.state.priceOfUnitOfAccount).div(10 ** 18)));
      openPrice = this.props.loan.loanData!.startRate.div(10 ** 18);
      liquidationPrice = liquidationRate;
      profit = openPrice.minus(this.state.priceOfAsset).times(position);
    }
    return (
      <React.Fragment>
        <div className={`inner-own-token-grid-row`}>
          <div className="inner-own-token-grid-row__col-token-name-full">
            {position.toFixed(2)}
            </div>
          {/*state.pTokenAddress &&
              FulcrumProvider.Instance.web3ProviderSettings &&
              FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                <a
                  className="inner-own-token-grid-row__col-token-name-full"
                  style={{ cursor: `pointer`, textDecoration: `none` }}
                  title={state.pTokenAddress}
                  href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${state.pTokenAddress}#readContract`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${props.currentKey.leverage}x`}&nbsp;
                  <PositionTypeMarkerAlt assetDetails={state.assetDetails} value={props.currentKey.positionType} />
                </a>
              ) : (
                <div className="inner-own-token-grid-row__col-token-name-full">{`${props.currentKey.leverage}x`}&nbsp;
                  <PositionTypeMarkerAlt assetDetails={state.assetDetails} value={props.currentKey.positionType} />
              </div>)*/}
          <div title={props.currentKey.unitOfAccount} className="inner-own-token-grid-row__col-asset-type">
            <span className="position-type-marker">{`${props.currentKey.leverage}x`}&nbsp; {props.currentKey.positionType}</span>
          </div>
          <div title={`$${value.toFixed(18)}`} className="inner-own-token-grid-row__col-asset-price">
            {!state.isLoading
              ? <React.Fragment>
                <span className="sign-currency">$</span>{value.toFixed(2)}
                <span className="inner-own-token-grid-row__col-asset-price-small">12.25%</span>
              </React.Fragment>
              : <Preloader width="74px" />
            }
          </div>
          <div className="inner-own-token-grid-row__col-asset-collateral">
            <React.Fragment>
              <span className="sign-currency">$</span>{collateral.toFixed(2)}
                <span className="inner-own-token-grid-row__col-asset-collateral-small">16.5%</span>
            </React.Fragment>
            <div className="inner-own-token-grid-row__open-manage-collateral" onClick={this.onManageClick}>
              <OpenManageCollateral />
            </div>
          </div>
          <div title={openPrice.toFixed(18)} className="inner-own-token-grid-row__col-position-value">
            {!state.isLoading
              ? state.assetBalance
                ? <React.Fragment><span className="sign-currency">$</span>{openPrice.toFixed(2)}</React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </div>
          <div title={`$${liquidationPrice.toFixed(18)}`} className="inner-own-token-grid-row__col-liquidation-price">
            {!state.isLoading
              ? <React.Fragment><span className="sign-currency">$</span>{liquidationPrice.toFixed(2)}</React.Fragment>
              : <Preloader width="74px" />
            }
          </div>
          <div title={profit.toFixed(18)} className="inner-own-token-grid-row__col-profit">
            {!state.isLoading ?
              state.profit
                ? <React.Fragment><span className="sign-currency">$</span>{profit.toFixed(2)}</React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </div>
          <div className="inner-own-token-grid-row__col-action">
            <button className="inner-own-token-grid-row_button inner-own-token-grid-row__sell-button inner-own-token-grid-row__button--size-half" onClick={this.onSellClick}>
              {TradeType.SELL}
            </button>
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
        TradeType.SELL,
        this.props.currentKey.asset,
        this.props.currentKey.unitOfAccount,
        this.props.currentKey.positionType === PositionType.SHORT ? this.props.currentKey.asset : Asset.USDC,
        this.props.currentKey.positionType,
        this.props.currentKey.leverage,
        new BigNumber(0),
        this.props.currentKey.isTokenized,
        this.props.currentKey.version,
        undefined,
        undefined,
        undefined,
        this.props.loan.loanId
      )
    );
  };
}
