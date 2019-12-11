import React, { Component } from "react";
import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { TradeTokenGridHeaderMobile } from "./TradeTokenGridHeaderMobile";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";
import { ITradeTokenGridRowMBProps, TradeTokenGridRowMobile } from "./TradeTokenGridRowMobile";
import { ITradeTokenGridRowFooterMBProps, TradeTokenGridRowMobileFooter } from "./TradeTokenGridRowFooterMobile";
import {TradeType} from "../domain/TradeType";
import {AssetsDictionary} from "../domain/AssetsDictionary";
import TagManager from "react-gtm-module";


// import siteConfig from "./../config/SiteConfig.json";

export interface ITradeTokenGridProps {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;
  defaultLeverageShort: number;
  defaultLeverageLong: number;
  isMobileMedia: boolean;
  onShowMyTokensOnlyChange: (value: boolean) => void;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
  isLong: boolean;
  isShort: boolean;
}

interface ITradeTokenGridState {
  tokenRowsData: ITradeTokenGridRowProps[];
  balance: BigNumber;
  tokenSingleRowsData: ITradeTokenGridRowProps[];
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {
  private static readonly assets: Asset[] = [
    Asset.ETH,
    // Asset.SAI,
    // Asset.DAI,
    // Asset.USDC,
    // Asset.SUSD,
    Asset.WBTC,
    Asset.LINK,
    // Asset.MKR,
    Asset.ZRX,
    // Asset.BAT,
    // Asset.REP,
    Asset.KNC
  ];

  constructor(props: ITradeTokenGridProps) {
    super(props);

    this.state = {
      tokenRowsData: TradeTokenGrid.getRowsData(props),
      balance: new BigNumber(0),
      tokenSingleRowsData:TradeTokenGrid.getSingleRowData(props),
    };
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public async derivedUpdate() {
    this.setState({ ...this.state, tokenRowsData: TradeTokenGrid.getRowsData(this.props) }) ;
  }

  public componentWillUnmount(): void {
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentDidMount(): void {
    const e = this.state.tokenRowsData[0];

    this.props.onSelect(new TradeTokenKey(e.asset, e.defaultUnitOfAccount, e.positionType, e.defaultLeverage, e.defaultTokenizeNeeded));

    this.derivedUpdate();
  }

  public componentDidUpdate(prevProps: Readonly<ITradeTokenGridProps>, prevState: Readonly<ITradeTokenGridState>, snapshot?: any): void {
    if (this.props.selectedKey !== prevProps.selectedKey || this.props.showMyTokensOnly !== prevProps.showMyTokensOnly) {
      this.derivedUpdate();
    }
  }

  public render() {

    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();

  }


  private renderDesktop = () => {
    const tokenRows = this.state.tokenRowsData.map(e => <TradeTokenGridRow key={`${e.asset}_${e.positionType}`} {...e} />);

    return (
      <div className="trade-token-grid">
        <TradeTokenGridHeader showMyTokensOnly={this.props.showMyTokensOnly} onShowMyTokensOnlyChange={this.props.onShowMyTokensOnlyChange} />
        {tokenRows}
      </div>
    );

  }

  private renderMobile = () => {
    // const assetDetails = AssetsDictionary.assets.get(this.state.tokenRowsData[0].asset);
    const tokenRowsMobile = this.state.tokenRowsData.map(e => <TradeTokenGridRowMobile key={`${e.asset}_${e.positionType}`} {...e} />);
    const tokenRowsFooterMobile = this.state.tokenSingleRowsData.map(e => <TradeTokenGridRowMobileFooter key={`${e.asset}_${e.positionType}`} {...e} />);
    return (
      <div className="trade-token-grid">
        <div className="trade-new-grid">
          {this.renderActions(this.state.balance.eq(0))}
        </div>
        <TradeTokenGridHeaderMobile showMyTokensOnly={this.props.showMyTokensOnly} onShowMyTokensOnlyChange={this.props.onShowMyTokensOnlyChange} />
        {tokenRowsMobile}
        <div className="trade-footer-mb">
          <div className="trade-foot-item">
            {tokenRowsFooterMobile}
          </div>
        </div>
      </div>
    );
  }

  private renderActions = (isBuyOnly: boolean) => {
    return isBuyOnly ? (
      <div className="trade-token-grid-row__col-action-mb">
        <button className="trade-token-grid-row__buy-button trade-token-grid-row__button--size-full" onClick={this.onBuyClick}>
          {TradeType.BUY}
        </button>
      </div>
    ) : (
      <div className="trade-token-grid-row__col-action-mb">
        <button className="trade-token-grid-row__buy-button trade-token-grid-row__button--size-half" onClick={this.onBuyClick}>
          {TradeType.BUY}
        </button>
        <button className="trade-token-grid-row__sell-button trade-token-grid-row__button--size-half" onClick={this.onSellClick}>
          {TradeType.SELL}
        </button>
      </div>
    );
  };
  public onBuyClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const e = this.state.tokenRowsData[0];
    console.log("e = ",e)
    console.log("e = ",e.selectedKey.leverage)
    // console.log("this.props.defaultTokenizeNeeded = ",this.props.defaultTokenizeNeeded)
    // console.log("this.props.defaultUnitOfAccount = ",this.props.defaultUnitOfAccount)


    const tagManagerArgs = {
                            dataLayer: {
                                name:e.selectedKey.leverage + 'x' + e.selectedKey.asset +'-'+ e.selectedKey.positionType +'-'+ e.defaultUnitOfAccount,
                                sku:e.selectedKey.leverage + 'x' + e.selectedKey.asset +'-'+ e.selectedKey.positionType,
                                category:e.selectedKey.positionType,
                                price:'0',
                                status:"In-progress"
                            },
                            dataLayerName: 'PageDataLayer'
                        }

    console.log("tagManagerArgs = "+tagManagerArgs)
    TagManager.dataLayer(tagManagerArgs)
    //
    this.props.onTrade(
      new TradeRequest(
        TradeType.BUY,
        e.selectedKey.asset,
        e.defaultUnitOfAccount, // TODO: depends on which one they own
        Asset.ETH,
        e.selectedKey.positionType,
        e.selectedKey.leverage,
        new BigNumber(0),
        e.defaultTokenizeNeeded, // TODO: depends on which one they own
        e.selectedKey.version
      )
    );
  };

  public onSellClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const e = this.state.tokenRowsData[0];
    this.props.onTrade(
      new TradeRequest(
        TradeType.SELL,
        e.selectedKey.asset,
        e.defaultUnitOfAccount, // TODO: depends on which one they own
        e.selectedKey.positionType === PositionType.SHORT ? e.selectedKey.asset : Asset.DAI,
        e.selectedKey.positionType,
        e.selectedKey.leverage,
        new BigNumber(0),
        e.defaultTokenizeNeeded, // TODO: depends on which one they own
        e.selectedKey.version
      )
    );
  };

  private static getRowsData = (props: ITradeTokenGridProps): ITradeTokenGridRowProps[] => {
    const rowsData: ITradeTokenGridRowProps[] = [];

    /*let defaultUnitOfAccount: Asset;
    if (Object.values(Asset).includes(siteConfig.Trade_defaultUnitOfAccount)) {
      defaultUnitOfAccount = Asset.[siteConfig.Trade_defaultUnitOfAccount];
    } else {
      defaultUnitOfAccount = Asset.DAI;
    }*/


    TradeTokenGrid.assets.forEach(e => {
      rowsData.push({
        selectedKey: props.selectedKey,
        asset: e,
        defaultUnitOfAccount: Asset.DAI,
        defaultTokenizeNeeded: true,
        positionType: PositionType.SHORT,
        defaultLeverage: props.defaultLeverageShort,
        onSelect: props.onSelect,
        onTrade: props.onTrade,
        onShowMyTokensOnlyChange: props.onShowMyTokensOnlyChange
      });

      /*let unit = Asset.USDC;
      if (props.selectedKey.asset === Asset.ETH && props.defaultLeverageLong === 2) {
        unit = Asset.DAI;
      }*/

      rowsData.push({
        selectedKey: props.selectedKey,
        asset: e,
        defaultUnitOfAccount: Asset.DAI,
        defaultTokenizeNeeded: true,
        positionType: PositionType.LONG,
        defaultLeverage: props.defaultLeverageLong,
        onSelect: props.onSelect,
        onTrade: props.onTrade,
        onShowMyTokensOnlyChange: props.onShowMyTokensOnlyChange
      });
    });

    return rowsData;
  };

  private static getSingleRowData = (props: ITradeTokenGridProps): ITradeTokenGridRowProps[] => {
    const singleRowData: ITradeTokenGridRowProps[] = [];

    /*let defaultUnitOfAccount: Asset;
    if (Object.values(Asset).includes(siteConfig.Trade_defaultUnitOfAccount)) {
      defaultUnitOfAccount = Asset.[siteConfig.Trade_defaultUnitOfAccount];
    } else {
      defaultUnitOfAccount = Asset.DAI;
    }*/


    TradeTokenGrid.assets.forEach(e => {
      if(props.isLong){
        singleRowData.push({
          selectedKey: props.selectedKey,
          asset: e,
          defaultUnitOfAccount: Asset.DAI,
          defaultTokenizeNeeded: true,
          positionType: PositionType.LONG,
          defaultLeverage: props.defaultLeverageShort,
          onSelect: props.onSelect,
          onTrade: props.onTrade,
          onShowMyTokensOnlyChange: props.onShowMyTokensOnlyChange
        });
      }
      /*let unit = Asset.USDC;
      if (props.selectedKey.asset === Asset.ETH && props.defaultLeverageLong === 2) {
        unit = Asset.DAI;
      }*/

      if(props.isShort){
        singleRowData.push({
          selectedKey: props.selectedKey,
          asset: e,
          defaultUnitOfAccount: Asset.DAI,
          defaultTokenizeNeeded: true,
          positionType: PositionType.SHORT,
          defaultLeverage: props.defaultLeverageLong,
          onSelect: props.onSelect,
          onTrade: props.onTrade,
          onShowMyTokensOnlyChange: props.onShowMyTokensOnlyChange
        });
      }

    });

    return singleRowData;
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    await this.derivedUpdate();
  };
}
