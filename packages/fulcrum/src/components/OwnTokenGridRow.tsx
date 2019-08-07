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
import { PositionTypeMarker } from "./PositionTypeMarker";
// import { Change24HMarker, Change24HMarkerSize } from "./Change24HMarker";

export interface IOwnTokenGridRowProps {
  selectedKey: TradeTokenKey;
  currentKey: TradeTokenKey;

  onDetails: (key: TradeTokenKey) => void;
  onManageCollateral: (request: ManageCollateralRequest) => void;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
}

interface IOwnTokenGridRowState {
  assetDetails: AssetDetails | null;

  latestAssetPriceDataPoint: IPriceDataPoint;
  assetBalance: BigNumber | null;
  profit: BigNumber | null;
  pTokenAddress: string;
}

export class OwnTokenGridRow extends Component<IOwnTokenGridRowProps, IOwnTokenGridRowState> {
  constructor(props: IOwnTokenGridRowProps, context?: any) {
    super(props, context);

    const assetDetails = AssetsDictionary.assets.get(props.currentKey.asset);

    this.state = {
      assetDetails: assetDetails || null,
      latestAssetPriceDataPoint: FulcrumProvider.Instance.getPriceDefaultDataPoint(),
      assetBalance: new BigNumber(0),
      profit: new BigNumber(0),
      pTokenAddress: ""
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private getTradeTokenGridRowSelectionKeyRaw(props: IOwnTokenGridRowProps, leverage: number = this.props.currentKey.leverage) {
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

    this.setState({
      ...this.state,
      latestAssetPriceDataPoint: latestAssetPriceDataPoint,
      assetBalance: assetBalance,
      profit: profit,
      pTokenAddress: address
    });
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
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderAvailable, this.onProviderAvailable);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  /*public componentDidUpdate(
    prevProps: Readonly<IOwnTokenGridRowProps>,
    prevState: Readonly<IOwnTokenGridRowState>,
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

  public render() {
    if (!this.state.assetDetails) {
      return null;
    }

    const bnPrice = new BigNumber(this.state.latestAssetPriceDataPoint.price);
    const bnLiquidationPrice = new BigNumber(this.state.latestAssetPriceDataPoint.liquidationPrice);
    /*if (this.props.currentKey.positionType === PositionType.SHORT) {
      bnPrice = bnPrice.div(1000);
      bnLiquidationPrice = bnLiquidationPrice.div(1000);
    }*/

    const isActiveClassName =
      this.props.currentKey.toString() === this.props.selectedKey.toString() ? "own-token-grid-row--active" : "";

    return (
      <div className={`own-token-grid-row ${isActiveClassName}`} onClick={this.onSelectClick}>
        <div
          className="own-token-grid-row__col-token-image"
          style={{ backgroundColor: this.state.assetDetails.bgColor, borderLeftColor: this.state.assetDetails.bgColor }}
        >
          <img src={this.state.assetDetails.logoSvg} alt={`${this.state.assetDetails.displayName} ${this.props.currentKey.leverage}x`} />
        </div>
        {this.state.pTokenAddress &&
          FulcrumProvider.Instance.web3ProviderSettings &&
          FulcrumProvider.Instance.web3ProviderSettings.etherscanURL ? (
          <a
            className="own-token-grid-row__col-token-name-full"
            style={{cursor: `pointer`, textDecoration: `none`}}
            title={this.state.pTokenAddress}
            href={`${FulcrumProvider.Instance.web3ProviderSettings.etherscanURL}address/${this.state.pTokenAddress}#readContract`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {`${this.state.assetDetails.displayName} ${this.props.currentKey.leverage}x`}
          </a>
        ) : (
          <div className="own-token-grid-row__col-token-name-full">{`${this.state.assetDetails.displayName} ${this.props.currentKey.leverage}x`}</div>
        )}
        <div className="own-token-grid-row__col-position-type">
          <PositionTypeMarker value={this.props.currentKey.positionType} />
        </div>

        <div title={this.props.currentKey.unitOfAccount} className="own-token-grid-row__col-asset-price">{this.props.currentKey.unitOfAccount}</div>
        <div title={`$${bnPrice.toFixed(18)}`} className="own-token-grid-row__col-asset-price">{`$${bnPrice.toFixed(2)}`}</div>
        <div title={`$${bnLiquidationPrice.toFixed(18)}`} className="own-token-grid-row__col-liquidation-price">{`$${bnLiquidationPrice.toFixed(2)}`}</div>
        <div title={this.state.assetBalance ? `$${this.state.assetBalance.toFixed(18)}` : ``} className="own-token-grid-row__col-position-value">{this.state.assetBalance ? `$${this.state.assetBalance.toFixed(2)}` : `$0.00`}</div>
        <div title={this.state.profit ? `$${this.state.profit.toFixed(18)}` : ``} className="own-token-grid-row__col-profit">{this.state.profit ? `$${this.state.profit.toFixed(4)}` : `$0.0000`}</div>

        

        <div className="own-token-grid-row__col-action" style={{ textAlign: `right`}}>
          {/*<button className="own-token-grid-row__details-button" onClick={this.onDetailsClick}>
            &nbsp;
            </button>*/}
          {/*<button className="own-token-grid-row__manage-button own-token-grid-row__button--size-half" onClick={this.onManageClick}>
            Manage
          </button>*/}
          <button className="own-token-grid-row__sell-button own-token-grid-row__button--size-half" onClick={this.onSellClick}>
            {TradeType.SELL}
          </button>
        </div>
      </div>
    );
  }

  public onSelectClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onSelect(this.getTradeTokenGridRowSelectionKey());
  };

  public onDetailsClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onDetails(this.props.currentKey);
  };

  public onManageClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onManageCollateral(new ManageCollateralRequest(new BigNumber(0)));
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
