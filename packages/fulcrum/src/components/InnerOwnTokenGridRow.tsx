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
//import { PositionTypeMarker } from "./PositionTypeMarker";
//import { PositionTypeMarkerAlt } from "./PositionTypeMarkerAlt";
// import { Change24HMarker, Change24HMarkerSize } from "./Change24HMarker";
import { Preloader } from "./Preloader";
import { ReactComponent as OpenManageCollateral } from "../assets/images/openManageCollateral.svg";

export interface IInnerOwnTokenGridRowProps {
  selectedKey: TradeTokenKey;
  currentKey: TradeTokenKey;
  showMyTokensOnly: boolean;

  // onDetails: (key: TradeTokenKey) => void;
  // onManageCollateral: (request: ManageCollateralRequest) => void;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
  onManageCollateralOpen: (request: ManageCollateralRequest) => void;
}

interface IInnerOwnTokenGridRowState {
  assetDetails: AssetDetails | null;

  latestAssetPriceDataPoint: IPriceDataPoint;
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  pTokenAddress: string;
  isLoading: boolean;
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
      pTokenAddress: "",
      isLoading: true
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
    const tradeTokenKey = new TradeTokenKey(
      this.props.currentKey.asset,
      this.props.currentKey.unitOfAccount,
      this.props.currentKey.positionType,
      this.props.currentKey.leverage,
      this.props.currentKey.isTokenized,
      this.props.currentKey.version
    );
    const latestAssetPriceDataPoint = await FulcrumProvider.Instance.getTradeTokenAssetLatestDataPoint(tradeTokenKey);

    const data: [BigNumber | null, BigNumber | null] = await FulcrumProvider.Instance.getTradeBalanceAndProfit(tradeTokenKey);
    const assetBalance = data[0];
    const profit = data[1];

    const address = FulcrumProvider.Instance.contractsSource ?
      await FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(tradeTokenKey) || "" :
      "";

    // const precision = AssetsDictionary.assets.get(this.props.selectedKey.loanAsset)!.decimals || 18;
    // const balanceString = this.props.balance.dividedBy(10 ** precision).toFixed();

    this._isMounted && this.setState(p => ({
      ...this.state,
      latestAssetPriceDataPoint: latestAssetPriceDataPoint,
      assetBalance: assetBalance,
      profit: profit,
      pTokenAddress: address,
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
  private renderOwnTokenRow = (state: IInnerOwnTokenGridRowState, props: IInnerOwnTokenGridRowProps, bnPrice: BigNumber, bnLiquidationPrice: BigNumber, isActiveClassName: string): React.ReactFragment => {
    if (!state.assetDetails) return <React.Fragment></React.Fragment>;
    return (
      <React.Fragment>
        <div className={`own-token-grid-row-inner ${isActiveClassName}`} onClick={this.onSelectClick}>
          <div className="own-token-grid-row-inner__col-token-name-full">
            0.8884
            </div>
          {/*state.pTokenAddress &&
              FulcrumProvider.Instance.web3ProviderSettings &&
              FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                <a
                  className="own-token-grid-row-inner__col-token-name-full"
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
                <div className="own-token-grid-row-inner__col-token-name-full">{`${props.currentKey.leverage}x`}&nbsp;
                  <PositionTypeMarkerAlt assetDetails={state.assetDetails} value={props.currentKey.positionType} />
              </div>)*/}
          <div title={props.currentKey.unitOfAccount} className="own-token-grid-row-inner__col-asset-type">
            <span className="position-type-marker">{`${props.currentKey.leverage}x`}&nbsp; {props.currentKey.positionType}</span>
          </div>
          <div title={`$${bnPrice.toFixed(18)}`} className="own-token-grid-row-inner__col-asset-price">
            {!state.isLoading
              ? <React.Fragment>
                <span className="sign-currency">$</span>{bnPrice.toFixed(2)}
                <span className="own-token-grid-row-inner__col-asset-price-small">12.25%</span>
              </React.Fragment>
              : <Preloader width="74px" />
            }
          </div>
          <div className="own-token-grid-row-inner__col-asset-collateral">
            <React.Fragment>
              <span className="sign-currency">$</span>15.25
                <span className="own-token-grid-row-inner__col-asset-collateral-small">16.5%</span>
            </React.Fragment>
            <div className="own-token-grid-row-inner__open-manage-collateral" onClick={this.onManageClick}>
              <OpenManageCollateral />
            </div>
          </div>
          <div title={state.assetBalance ? `$${state.assetBalance.toFixed(18)}` : ``} className="own-token-grid-row-inner__col-position-value">
            {!state.isLoading
              ? state.assetBalance
                ? <React.Fragment><span className="sign-currency">$</span>{state.assetBalance.toFixed(2)}</React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </div>
          <div title={`$${bnLiquidationPrice.toFixed(18)}`} className="own-token-grid-row-inner__col-liquidation-price">
            {!state.isLoading
              ? <React.Fragment><span className="sign-currency">$</span>{bnLiquidationPrice.toFixed(2)}</React.Fragment>
              : <Preloader width="74px" />
            }
          </div>
          <div title={state.profit ? `$${state.profit.toFixed(18)}` : ``} className="own-token-grid-row-inner__col-profit">
            {!state.isLoading ?
              state.profit
                ? <React.Fragment><span className="sign-currency">$</span>{state.profit.toFixed(2)}</React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </div>
          <div className="own-token-grid-row-inner__col-action">
            <button className="own-token-grid-row-inner_button own-token-grid-row-inner__sell-button own-token-grid-row-inner__button--size-half" onClick={this.onSellClick}>
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
    const isActiveClassName =
      this.props.currentKey.toString() === this.props.selectedKey.toString() ? "own-token-grid-row--active" : "";

    return this.renderOwnTokenRow(this.state, this.props, bnPrice, bnLiquidationPrice, isActiveClassName);
  }

  public onSelectClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onSelect(this.getTradeTokenGridRowSelectionKey());
  };

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
        this.props.currentKey.version
      )
    );
  };
}
