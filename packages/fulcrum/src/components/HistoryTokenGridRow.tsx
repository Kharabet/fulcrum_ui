import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { IPriceDataPoint } from "../domain/IPriceDataPoint";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { Preloader } from "./Preloader";

export interface IHistoryTokenGridRowProps {
  selectedKey: TradeTokenKey;
  currentKey: TradeTokenKey;
  showMyTokensOnly: boolean;

  // onDetails: (key: TradeTokenKey) => void;
  // onManageCollateral: (request: ManageCollateralRequest) => void;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
}

interface IHistoryTokenGridRowState {
  assetDetails: AssetDetails | null;

  latestAssetPriceDataPoint: IPriceDataPoint;
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  pTokenAddress: string;
  isLoading: boolean;
}

export class HistoryTokenGridRow extends Component<IHistoryTokenGridRowProps, IHistoryTokenGridRowState> {
  constructor(props: IHistoryTokenGridRowProps, context?: any) {
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

  private getTradeTokenGridRowSelectionKeyRaw(props: IHistoryTokenGridRowProps, leverage: number = this.props.currentKey.leverage) {
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

  public componentDidMount(): void {
    this._isMounted = true;

    this.derivedUpdate();
  }
  private renderOwnTokenRowHistory = (state: IHistoryTokenGridRowState, props: IHistoryTokenGridRowProps, bnPrice: BigNumber, bnLiquidationPrice: BigNumber): React.ReactFragment => {
    if (!state.assetDetails) return <React.Fragment></React.Fragment>;
    return (
      <React.Fragment>
        <div className="own-token-grid-row-history">
          <div className="own-token-grid-row-history__col-token-date">
            12 June 2019
          </div>
          <div className="own-token-grid-row-history__col-token-asset">
            SAI
          </div>
          <div className="own-token-grid-row-history__col-type">
            <div className="position-type-marker">
              {`${props.currentKey.leverage}x ${props.currentKey.positionType}`}
            </div>
          </div>
          <div className="own-token-grid-row-history__col-asset-unit">
            {props.currentKey.unitOfAccount}
          </div>
          <div className="own-token-grid-row-history__col-position">
            0.8884
          </div>
          <div className="own-token-grid-row-history__col-asset-price">
            {!state.isLoading
              ? <React.Fragment>
                <span className="sign-currency">$</span>{bnPrice.toFixed(2)}
              </React.Fragment>
              : <Preloader width="74px" />
            }
          </div>
          <div className="own-token-grid-row-history__col-liquidation-price">
            {!state.isLoading
              ? state.assetBalance
                ? <React.Fragment>
                  <span className="sign-currency">$</span>{bnLiquidationPrice.toFixed(2)}
                </React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </div>
          <div className="own-token-grid-row-history__col-position-value">
            {!state.isLoading
              ? state.assetBalance
                ? <React.Fragment>
                  <span className="sign-currency">$</span>{state.assetBalance.toFixed(2)}
                </React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </div>
          <div className="own-token-grid-row-history__col-profit">
            {!state.isLoading
              ? state.profit
                ? <React.Fragment>
                  <span className="sign-currency">$</span>{state.profit.toFixed(2)}
                </React.Fragment>
                : '$0.00'
              : <Preloader width="74px" />
            }
          </div>
          <div className="own-token-grid-row-history__result">
            Liquidated
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

    return this.renderOwnTokenRowHistory(this.state, this.props, bnPrice, bnLiquidationPrice);
  }
}