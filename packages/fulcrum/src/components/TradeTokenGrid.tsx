import { BigNumber } from "@0x/utils";
import React, { ChangeEvent, Component } from "react";
import TagManager from "react-gtm-module";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { PositionType } from "../domain/PositionType";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { TradeType } from "../domain/TradeType";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { TradeTokenGridHeaderMobile } from "./TradeTokenGridHeaderMobile";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";
import { ITradeTokenGridRowFooterMBProps, TradeTokenGridRowMobileFooter } from "./TradeTokenGridRowFooterMobile";
import { ITradeTokenGridRowMBProps, TradeTokenGridRowMobile } from "./TradeTokenGridRowMobile";
import { ITradeTokenCardMobileProps, TradeTokenCardMobile } from "./TradeTokenCardMobile";
import walletSvg from "../assets/images/wallet-icon.svg";
import { OwnTokenGridInner } from "./OwnTokenGridInner";

// import siteConfig from "./../config/SiteConfig.json";

export interface ITradeTokenGridProps {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;
  defaultLeverageShort: number;
  defaultLeverageLong: number;
  isMobileMedia: boolean;
  assets: Asset[];
  onShowMyTokensOnlyChange: (value: boolean) => void;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
  changeActiveBtn: (activeType: string) => void;
  isLong: boolean;
  isShort: boolean;
}

interface ITradeTokenGridState {
  tokenRowsData: ITradeTokenGridRowProps[];
  balance: BigNumber;
  tokenSingleRowsData: ITradeTokenGridRowMBProps[];
  tokenLongShortRowsData: ITradeTokenCardMobileProps[];
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {

  private static readonly longVal = [2,3,4,5];
  private static readonly shortVal = [1,2,3,4,5];
  private static changeActiveBtn: (activeType: string) => void;

  private static defaultUnitOfAccount: Asset;

  constructor(props: ITradeTokenGridProps) {
    super(props);

    TradeTokenGrid.defaultUnitOfAccount = process.env.REACT_APP_ETH_NETWORK === "kovan" ?
      Asset.SAI :
      Asset.DAI;

    TradeTokenGrid.changeActiveBtn = props.changeActiveBtn;


    this.state = {
      tokenRowsData: TradeTokenGrid.getRowsData(props),
      balance: new BigNumber(0),
      tokenSingleRowsData: TradeTokenGrid.getSingleRowData(props),
      tokenLongShortRowsData: TradeTokenGrid.getRowsLongShortData(props),
    };
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  public async derivedUpdate() {
    if (!this.props.isMobileMedia) {
      await this.setState({ ...this.state, tokenRowsData: TradeTokenGrid.getRowsData(this.props) });
      await this.setState({ ...this.state, tokenSingleRowsData: TradeTokenGrid.getSingleRowData(this.props) });

    } else {
      await this.setState({ ...this.state, tokenSingleRowsData: TradeTokenGrid.getSingleRowData(this.props) });
      await this.setState({ ...this.state, tokenSingleRowsData: TradeTokenGrid.getSingleRowData(this.props), tokenLongShortRowsData: TradeTokenGrid.getRowsLongShortData(this.props) });
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

    if (this.props.isLong !== prevProps.isLong) {
      this.setState({ ...this.state, tokenSingleRowsData: TradeTokenGrid.getSingleRowData(this.props) });

      this.setState({ ...this.state, tokenLongShortRowsData: TradeTokenGrid.getRowsLongShortData(this.props) });
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
    const tokenRowsFooterMobile = this.state.tokenSingleRowsData.map(e => <TradeTokenGridRowMobileFooter isMobile={this.props.isMobileMedia} key={`${e.asset}_${e.positionType}`} {...e} />);
    let tradeTokenGridProps = this.props;
    return (
      <div className="trade-token-grid__wrapper">

        <div className="trade-token-grid">
          <TradeTokenGridHeader showMyTokensOnly={this.props.showMyTokensOnly} onShowMyTokensOnlyChange={this.props.onShowMyTokensOnlyChange} />
          {tokenRows && tokenRows.map(row => {
            return (<div className="trade-token-grid-row-wrapper" key={`${row.props.asset}_${row.props.positionType}`}>
              {row}
              <OwnTokenGridInner positionType={row.props.positionType} asset={row.props.asset} {...tradeTokenGridProps}/>
            </div>)
          })}
        </div>
      </div>
    );

  }

  private renderMobile = () => {
    // const assetDetails = AssetsDictionary.assets.get(this.state.tokenRowsData[0].asset);
    const tokenRowsFooterMobile = this.state.tokenSingleRowsData.map(e => <TradeTokenGridRowMobileFooter isMobile={this.props.isMobileMedia} key={`${e.asset}_${e.positionType}`} {...e} />);
    // const tokenRowsMobile = this.state.tokenRowsData.map(e => <TradeTokenGridRowMobile key={`${e.asset}_${e.positionType}_${e.defaultLeverage}`} {...e} />);
    const tokenRowsMobile = this.state.tokenLongShortRowsData.map(e => <TradeTokenCardMobile key={`${e.asset}_${e.positionType}`} {...e} />);
    return (
      <div className="trade-token-card-mobile__wrapper">

        {tokenRowsMobile}
      </div>
    );
  }

  public showMyTokensOnlyChange = () => {
    this.props.onShowMyTokensOnlyChange(true);
  }

  private renderActions = (isBuyOnly: boolean) => {
    return (<div className="trade-token-grid-row__col-action-mb">
      <button className="trade-token-grid-row__buy-button trade-token-grid-row__button--size-half" onClick={this.onBuyClick}>
        {TradeType.BUY}
      </button>
    </div>
    )
  };
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
        onTrade: props.onTrade,
        onShowMyTokensOnlyChange: props.onShowMyTokensOnlyChange
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
        onTrade: props.onTrade,
        onShowMyTokensOnlyChange: props.onShowMyTokensOnlyChange
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

    props.assets.forEach(e => {
      if (props.isShort) {
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
      if (props.isLong) {
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
