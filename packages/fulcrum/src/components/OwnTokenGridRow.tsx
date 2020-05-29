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
import { RequestStatus } from "../domain/RequestStatus";
import { RequestTask } from "../domain/RequestTask";
import { CircleLoader } from "./CircleLoader";
import { TradeTxLoaderStep } from "./TradeTxLoaderStep";

export interface IOwnTokenGridRowProps {
  loanId: string;
  currentKey: TradeTokenKey;

  pTokenAddress: string;
  onTrade: (request: TradeRequest) => void;
  onManageCollateralOpen: (request: ManageCollateralRequest) => void;
  changeLoadingTransaction: (isLoadingTransaction: boolean, request: TradeRequest | undefined, resultTx: boolean) => void;
}

interface IOwnTokenGridRowState {
  assetDetails: AssetDetails | null;
  latestAssetPriceDataPoint: IPriceDataPoint;
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  isLoading: boolean;
  isLoadingTransaction: boolean;
  request: TradeRequest | undefined;
}

export class OwnTokenGridRow extends Component<IOwnTokenGridRowProps, IOwnTokenGridRowState> {
  constructor(props: IOwnTokenGridRowProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.currentKey.asset);

    this._isMounted = false;

    this.state = {
      assetDetails: assetDetails || null,
      latestAssetPriceDataPoint: FulcrumProvider.Instance.getPriceDefaultDataPoint(),
      assetBalance: new BigNumber(0),
      profit: new BigNumber(0),
      isLoading: true,
      isLoadingTransaction: false,
      request: undefined,
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  private getTradeTokenGridRowSelectionKeyRaw(props: IOwnTokenGridRowProps, leverage: number = this.props.currentKey.leverage) {
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

  private onAskToOpenProgressDlg = (taskId: number) => {
    if (!this.state.request || taskId !== this.state.request.id) return;
    this.setState({ ...this.state, isLoadingTransaction: true, })
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true);
  }
  private onAskToCloseProgressDlg = (task: RequestTask) => {
    if (!this.state.request || task.request.id !== this.state.request.id) return;
    if (task.status === RequestStatus.FAILED || task.status === RequestStatus.FAILED_SKIPGAS) {
      window.setTimeout(() => {
        FulcrumProvider.Instance.onTaskCancel(task);
        this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });
        this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, false);
      }, 5000)
      return;
    }
    this.setState({ ...this.state, isLoadingTransaction: false, request: undefined });
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, this.state.request, true);
  }

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    if (event.key.toString() === this.props.currentKey.toString()) {
      await this.derivedUpdate();
    }
  };

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToOpenProgressDlg, this.onAskToOpenProgressDlg);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.AskToCloseProgressDlg, this.onAskToCloseProgressDlg);
    FulcrumProvider.Instance.eventEmitter.off(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }
  public componentWillMount(): void {
    this.derivedUpdate();
  }

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }

  private renderOwnTokenRow = (state: IOwnTokenGridRowState, props: IOwnTokenGridRowProps, bnPrice: BigNumber, bnLiquidationPrice: BigNumber): React.ReactFragment => {
    if (!state.assetDetails) return <React.Fragment></React.Fragment>;
    return (
      <React.Fragment>
        {this.state.isLoadingTransaction && this.state.request
          ? <React.Fragment>
            <div className="token-selector-item__image">
              <CircleLoader></CircleLoader>
              <TradeTxLoaderStep taskId={this.state.request.id} />
            </div>
          </React.Fragment>
          : <div className={`own-token-grid-row`}>
            {props.pTokenAddress &&
              FulcrumProvider.Instance.web3ProviderSettings &&
              FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
                <a
                  className="own-token-grid-row__col-token-name opacityIn"
                  style={{ cursor: `pointer`, textDecoration: `none` }}
                  title={props.pTokenAddress}
                  href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${props.pTokenAddress}#readContract`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {state.assetDetails.displayName}&nbsp;
                </a>
              ) : (
                <div className="own-token-grid-row__col-token-name">{`${state.assetDetails.displayName}`}
                </div>)}

            <div className="own-token-grid-row__col-position-type opacityIn">
              <span className="position-type-marker">
                {`${props.currentKey.leverage}x ${props.currentKey.positionType}`}
              </span>
            </div>

            <div title={props.currentKey.unitOfAccount} className="own-token-grid-row__col-asset-unit opacityIn">
              {props.currentKey.unitOfAccount}
            </div>
            <div title={props.currentKey.unitOfAccount} className="own-token-grid-row__col-position opacityIn">
              0.8884
            </div>
            <div title={`$${bnPrice.toFixed(18)}`} className="own-token-grid-row__col-asset-price opacityIn">
              {!state.isLoading
                ? <React.Fragment>
                  <span className="sign-currency">$</span>{bnPrice.toFixed(2)}
                </React.Fragment>
                : <Preloader width="74px" />
              }
            </div>
            <div title={`$${bnPrice.toFixed(18)}`} className="own-token-grid-row__col-liquidation-price opacityIn">
              {!state.isLoading
                ? state.assetBalance
                  ? <React.Fragment>
                    <span className="sign-currency">$</span>{bnLiquidationPrice.toFixed(2)}
                  </React.Fragment>
                  : '$0.00'
                : <Preloader width="74px" />
              }
            </div>
            <div className="own-token-grid-row__col-collateral opacityIn">
              <div className="own-token-grid-row__col-collateral-wrapper">
                <span><span className="sign-currency">$</span>15.25</span>
                <span className="own-token-grid-row__col-asset-collateral-small">16.5%</span>
              </div>
              <div className="own-token-grid-row__open-manage-collateral" onClick={this.onManageClick}>
                <OpenManageCollateral />
              </div>
            </div>
            <div title={state.assetBalance ? `$${state.assetBalance.toFixed(18)}` : ``} className="own-token-grid-row__col-position-value opacityIn">
              {!state.isLoading
                ? state.assetBalance
                  ? <React.Fragment>
                    <span className="sign-currency">$</span>{state.assetBalance.toFixed(2)}
                  </React.Fragment>
                  : '$0.00'
                : <Preloader width="74px" />
              }
            </div>
            <div title={state.profit ? `$${state.profit.toFixed(18)}` : ``} className="own-token-grid-row__col-profit opacityIn">
              {!state.isLoading
                ? state.profit
                  ? <React.Fragment>
                    <span className="sign-currency">$</span>{state.profit.toFixed(2)}
                  </React.Fragment>
                  : '$0.00'
                : <Preloader width="74px" />
              }
            </div>
            <div className="own-token-grid-row__col-action opacityIn rightIn">
              <button className="own-token-grid-row_button own-token-grid-row__sell-button own-token-grid-row__button--size-half" onClick={this.onSellClick}>
                {TradeType.SELL}
              </button>
            </div>
          </div>
        }
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

    // this.props.onDetails(this.props.currentKey);
  };

  public onManageClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const request = new ManageCollateralRequest(
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
    await this.setState({ ...this.state, request: request });
    this.props.onManageCollateralOpen(request);
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, true);

  };

  public onSellClick = async (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const request = new TradeRequest(
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
      this.props.loanId
    )
    await this.setState({ ...this.state, request: request });
    this.props.onTrade(request);
    this.props.changeLoadingTransaction(this.state.isLoadingTransaction, request, true);
  };
}
