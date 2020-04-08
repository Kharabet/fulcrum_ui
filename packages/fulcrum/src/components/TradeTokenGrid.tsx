import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component } from "react";
import TagManager from "react-gtm-module";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";
import { ITradeTokenCardMobileProps, TradeTokenCardMobile } from "./TradeTokenCardMobile";
import { InnerOwnTokenGrid } from "./InnerOwnTokenGrid";

// import siteConfig from "./../config/SiteConfig.json";

export interface ITradeTokenGridProps {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;
  defaultLeverageShort: number;
  defaultLeverageLong: number;
  isMobileMedia: boolean;
  assets: Asset[];
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
  changeActiveBtn: (activeType: string) => void;
  isLong: boolean;
  isShort: boolean;
}

interface ITradeTokenGridState {
  tokenRowsData: ITradeTokenGridRowProps[];
  balance: BigNumber;
  tokenLongShortRowsData: ITradeTokenCardMobileProps[];
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {

  private static changeActiveBtn: (activeType: string) => void;

  private static defaultUnitOfAccount: Asset;

  constructor(props: ITradeTokenGridProps) {
    super(props);

    TradeTokenGrid.defaultUnitOfAccount = process.env.REACT_APP_ETH_NETWORK === "kovan" ?
      Asset.SAI :
      Asset.DAI;

    TradeTokenGrid.changeActiveBtn = props.changeActiveBtn;

    this._isMounted = false;
    this.state = {
      tokenRowsData: TradeTokenGrid.getRowsData(props),
      balance: new BigNumber(0),
      tokenLongShortRowsData: TradeTokenGrid.getRowsLongShortData(props),
    };
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  public async derivedUpdate() {
    if (!this.props.isMobileMedia) {
      await this._isMounted && this.setState({ ...this.state, tokenRowsData: TradeTokenGrid.getRowsData(this.props) });

    } else {
      await this._isMounted && this.setState({ ...this.state, tokenLongShortRowsData: TradeTokenGrid.getRowsLongShortData(this.props) });
    }
  }

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public componentDidMount(): void {
    this._isMounted = true;

    const e = this.state.tokenRowsData[0];

    this.props.onSelect(new TradeTokenKey(e.asset, e.defaultUnitOfAccount, e.positionType, e.defaultLeverage, e.defaultTokenizeNeeded));

    this.derivedUpdate();
  }

  public componentDidUpdate(prevProps: Readonly<ITradeTokenGridProps>, prevState: Readonly<ITradeTokenGridState>, snapshot?: any): void {

    if (this.props.isLong !== prevProps.isLong) {

      this._isMounted && this.setState({ ...this.state, tokenLongShortRowsData: TradeTokenGrid.getRowsLongShortData(this.props) });
    }

    if (this.props.selectedKey !== prevProps.selectedKey || this.props.showMyTokensOnly !== prevProps.showMyTokensOnly) {
      this.derivedUpdate();
    }
  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }


  private renderDesktop = () => {
    let tokenRows;
    if (this.props.selectedKey.asset !== Asset.UNKNOWN) {
      tokenRows = this.state.tokenRowsData.map(e => <TradeTokenGridRow key={`${e.asset}_${e.positionType}`} {...e} />);
    }
    let tradeTokenGridProps = this.props;
    return (
      <div className="trade-token-grid__wrapper">

        <div className="trade-token-grid">
          <TradeTokenGridHeader showMyTokensOnly={this.props.showMyTokensOnly} />
          {tokenRows && tokenRows.map(row => {
            return (<div className="trade-token-grid-row-wrapper" key={`${row.props.asset}_${row.props.positionType}`}>
              {row}
              <InnerOwnTokenGrid positionType={row.props.positionType} asset={row.props.asset} {...tradeTokenGridProps} />
            </div>)
          })}
        </div>
      </div>
    );

  }

  private renderMobile = () => {
    const tokenRowsMobile = this.state.tokenLongShortRowsData.map(e => <TradeTokenCardMobile key={`${e.asset}_${e.positionType}`} {...e} />);
    return (
      <div className="trade-token-card-mobile__wrapper">

        {tokenRowsMobile}
      </div>
    );
  }

  public onBuyClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const e = this.props;

    const tagManagerArgs = {
      dataLayer: {
        name: e.selectedKey.leverage + 'x' + e.selectedKey.asset + '-' + e.selectedKey.positionType + '-' + e.selectedKey.unitOfAccount,
        sku: e.selectedKey.leverage + 'x' + e.selectedKey.asset + '-' + e.selectedKey.positionType,
        category: e.selectedKey.positionType,
        price: '0',
        status: "In-progress"
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


    props.assets.forEach(e => {
      if (props.selectedKey.asset === Asset.UNKNOWN || e == props.selectedKey.asset) {
        rowsData.push({
          selectedKey: props.selectedKey,
          asset: e,
          defaultUnitOfAccount: TradeTokenGrid.defaultUnitOfAccount,
          defaultTokenizeNeeded: true,
          positionType: PositionType.LONG,
          defaultLeverage: props.defaultLeverageLong,
          onSelect: props.onSelect,
          onTrade: props.onTrade
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
          positionType: PositionType.SHORT,
          defaultLeverage: props.defaultLeverageShort,
          onSelect: props.onSelect,
          onTrade: props.onTrade
        });
      }
    });

    return rowsData;
  };
  private static getRowsLongShortData = (props: ITradeTokenGridProps): ITradeTokenCardMobileProps[] => {
    const singleRowMBData: ITradeTokenCardMobileProps[] = [];

    /*let defaultUnitOfAccount: Asset;
    if (Object.values(Asset).includes(siteConfig.Trade_defaultUnitOfAccount)) {
      defaultUnitOfAccount = Asset.[siteConfig.Trade_defaultUnitOfAccount];
    } else {
      defaultUnitOfAccount = Asset.DAI;
    }*/

    if (props.isLong) {
      singleRowMBData.push({
        selectedKey: props.selectedKey,
        asset: props.selectedKey.asset,
        defaultUnitOfAccount: TradeTokenGrid.defaultUnitOfAccount,
        defaultTokenizeNeeded: true,
        positionType: PositionType.LONG,
        changeActiveBtn: TradeTokenGrid.changeActiveBtn,
        onSelect: props.onSelect,
        onTrade: props.onTrade
      })
    }
    /*let unit = Asset.USDC;
    if (props.selectedKey.asset === Asset.ETH && props.defaultLeverageLong === 2) {
      unit = Asset.DAI;
    }*/

    if (props.isShort) {
      singleRowMBData.push({
        selectedKey: props.selectedKey,
        asset: props.selectedKey.asset,
        defaultUnitOfAccount: TradeTokenGrid.defaultUnitOfAccount,
        defaultTokenizeNeeded: true,
        positionType: PositionType.SHORT,
        changeActiveBtn: TradeTokenGrid.changeActiveBtn,
        onSelect: props.onSelect,
        onTrade: props.onTrade
      });
    }

    return singleRowMBData;
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    await this.derivedUpdate();
  };
}
