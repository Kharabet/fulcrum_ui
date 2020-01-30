import { BigNumber } from "@0x/utils";
import React, {ChangeEvent, Component} from "react";
import TagManager from "react-gtm-module";
import { Asset } from "../domain/Asset";
import {AssetsDictionary} from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import {TradeType} from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { TradeTokenGridHeaderMobile } from "./TradeTokenGridHeaderMobile";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";
import { ITradeTokenGridRowFooterMBProps, TradeTokenGridRowMobileFooter } from "./TradeTokenGridRowFooterMobile";
import { ITradeTokenGridRowMBProps, TradeTokenGridRowMobile } from "./TradeTokenGridRowMobile";
import  settingSvg  from "../assets/images/settings.svg";

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
  tokenSingleRowsData: ITradeTokenGridRowMBProps[];
  tokenLongShortRowsData: ITradeTokenGridRowProps[];
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {
  private static assets: Asset[];

  private static readonly longVal = [2,3,4];
  private static readonly shortVal = [1,2,3,4];

  private static defaultUnitOfAccount: Asset;

  constructor(props: ITradeTokenGridProps) {
    super(props);

    TradeTokenGrid.defaultUnitOfAccount = process.env.REACT_APP_ETH_NETWORK === "kovan" ?
      Asset.SAI :
      Asset.DAI;

    if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      TradeTokenGrid.assets = [
        Asset.ETH
      ];
    } if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      TradeTokenGrid.assets = [
      ];
    } else {
      TradeTokenGrid.assets = [
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
    }

    this.state = {
      tokenRowsData: TradeTokenGrid.getRowsData(props),
      balance: new BigNumber(0),
      tokenSingleRowsData:TradeTokenGrid.getSingleRowData(props),
      tokenLongShortRowsData:TradeTokenGrid.getRowsLongShortData(props),
    };
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public async derivedUpdate() {
    if(!this.props.isMobileMedia){
      this.setState({ ...this.state, tokenRowsData: TradeTokenGrid.getRowsData(this.props) }) ;
    }else{
      this.setState({ ...this.state, tokenSingleRowsData:TradeTokenGrid.getSingleRowData(this.props) }) ;
      this.setState({ ...this.state, tokenSingleRowsData:TradeTokenGrid.getSingleRowData(this.props), tokenLongShortRowsData:TradeTokenGrid.getRowsLongShortData(this.props) }) ;
    }

      // this.setState({ ...this.state, tokenSingleRowsData:TradeTokenGrid.getSingleRowData(this.props) }) ;
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

    if(this.props.isLong !==  prevProps.isLong){
      this.setState({ ...this.state, tokenSingleRowsData:TradeTokenGrid.getSingleRowData(this.props) }) ;

      this.setState({ ...this.state, tokenLongShortRowsData:TradeTokenGrid.getRowsLongShortData(this.props) }) ;
    }

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
    const tokenRowsFooterMobile = this.state.tokenSingleRowsData.map(e => <TradeTokenGridRowMobileFooter key={`${e.asset}_${e.positionType}`} {...e} />);
    const tokenRowsMobile = this.state.tokenLongShortRowsData.map(e => <TradeTokenGridRowMobile key={`${e.asset}_${e.positionType}_${e.defaultLeverage}`} {...e} />);
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
            <div
            className={`trade-token-grid-row__col-token-image settings-img-div`} onClick={this.showMyTokensOnlyChange}>
            <img className={`settings-img`} src={settingSvg} />
          </div>
          </div>
        </div>
      </div>
    );
  }

  public showMyTokensOnlyChange = () => {
    this.props.onShowMyTokensOnlyChange(true);
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
    const e = this.props;

    const tagManagerArgs = {
                              dataLayer: {
                                  name:e.selectedKey.leverage + 'x' + e.selectedKey.asset +'-'+ e.selectedKey.positionType +'-'+ e.selectedKey.unitOfAccount,
                                  sku:e.selectedKey.leverage + 'x' + e.selectedKey.asset +'-'+ e.selectedKey.positionType,
                                  category:e.selectedKey.positionType,
                                  price:'0',
                                  status:"In-progress"
                              },
                              dataLayerName: 'PageDataLayer'
                          }


    TagManager.dataLayer(tagManagerArgs)
    //
    this.props.onTrade(
      new TradeRequest(
        TradeType.BUY,
        e.selectedKey.asset,
        e.selectedKey.unitOfAccount, // TODO: depends on which one they own
        Asset.ETH,
        e.selectedKey.positionType,
        e.selectedKey.leverage,
        new BigNumber(0),
        e.selectedKey.isTokenized, // TODO: depends on which one they own
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
        defaultUnitOfAccount: TradeTokenGrid.defaultUnitOfAccount,
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
        defaultUnitOfAccount: TradeTokenGrid.defaultUnitOfAccount,
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
  private static getRowsLongShortData = (props: ITradeTokenGridProps): ITradeTokenGridRowMBProps[] => {
    const singleRowMBData: ITradeTokenGridRowMBProps[] = [];

    /*let defaultUnitOfAccount: Asset;
    if (Object.values(Asset).includes(siteConfig.Trade_defaultUnitOfAccount)) {
      defaultUnitOfAccount = Asset.[siteConfig.Trade_defaultUnitOfAccount];
    } else {
      defaultUnitOfAccount = Asset.DAI;
    }*/

    if(props.isLong){
        TradeTokenGrid.longVal.forEach(e => {
          singleRowMBData.push({
            selectedKey: props.selectedKey,
            asset: props.selectedKey.asset,
            defaultUnitOfAccount: TradeTokenGrid.defaultUnitOfAccount,
            defaultTokenizeNeeded: true,
            positionType: PositionType.LONG,
            defaultLeverage: e,
            onSelect: props.onSelect,
            onTrade: props.onTrade,
            onShowMyTokensOnlyChange: props.onShowMyTokensOnlyChange
          });
        })
      }
      /*let unit = Asset.USDC;
      if (props.selectedKey.asset === Asset.ETH && props.defaultLeverageLong === 2) {
        unit = Asset.DAI;
      }*/

      if(props.isShort){
        TradeTokenGrid.shortVal.forEach(e => {
          singleRowMBData.push({
            selectedKey: props.selectedKey,
            asset: props.selectedKey.asset,
            defaultUnitOfAccount: TradeTokenGrid.defaultUnitOfAccount,
            defaultTokenizeNeeded: true,
            positionType: PositionType.SHORT,
            defaultLeverage: e,
            onSelect: props.onSelect,
            onTrade: props.onTrade,
            onShowMyTokensOnlyChange: props.onShowMyTokensOnlyChange
          });
        });
      }

    return singleRowMBData;
  };

  private static getSingleRowData = (props: ITradeTokenGridProps): ITradeTokenGridRowProps[] => {
    let rowsData: ITradeTokenGridRowProps[] = [];

    /*let defaultUnitOfAccount: Asset;
    if (Object.values(Asset).includes(siteConfig.Trade_defaultUnitOfAccount)) {
      defaultUnitOfAccount = Asset.[siteConfig.Trade_defaultUnitOfAccount];
    } else {
      defaultUnitOfAccount = Asset.DAI;
    }*/

      TradeTokenGrid.assets.forEach(e => {
      if(props.isShort){
        rowsData.push({
          selectedKey: props.selectedKey,
          asset: e,
          defaultUnitOfAccount: TradeTokenGrid.defaultUnitOfAccount,
          defaultTokenizeNeeded: true,
          positionType: PositionType.SHORT,
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
      if(props.isLong) {
        rowsData.push({
          selectedKey: props.selectedKey,
          asset: e,
          defaultUnitOfAccount: TradeTokenGrid.defaultUnitOfAccount,
          defaultTokenizeNeeded: true,
          positionType: PositionType.LONG,
          defaultLeverage: props.defaultLeverageLong,
          onSelect: props.onSelect,
          onTrade: props.onTrade,
          onShowMyTokensOnlyChange: props.onShowMyTokensOnlyChange
        });
      }
    });

    return rowsData;

  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    await this.derivedUpdate();
  };
}
