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
import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";

// import siteConfig from "./../config/SiteConfig.json";

export interface ITradeTokenGridProps {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;
  defaultLeverage: number;
  isMobileMedia: boolean;
  assets: Asset[];
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
  onManageCollateralOpen: (request: ManageCollateralRequest) => void;
  changeActiveBtn: (activeType: string) => void;
  isLong: boolean;
  isShort: boolean;
  getTokenRowsData: ITradeTokenGridRowProps[];
  getOwnRowsData: Promise<IOwnTokenGridRowProps[]>;
}

interface ITradeTokenGridState {
  tokenRowsData: ITradeTokenGridRowProps[];
  ownRowsData: IOwnTokenGridRowProps[];
  balance: BigNumber;
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {

  //private static changeActiveBtn: (activeType: string) => void;

  private static defaultUnitOfAccount: Asset;

  constructor(props: ITradeTokenGridProps) {
    super(props);

    TradeTokenGrid.defaultUnitOfAccount = process.env.REACT_APP_ETH_NETWORK === "kovan"
      ? Asset.SAI
      : Asset.DAI;

    //TradeTokenGrid.changeActiveBtn = props.changeActiveBtn;

    this._isMounted = false;
    this.state = {
      tokenRowsData: props.getTokenRowsData,
      ownRowsData: [],
      balance: new BigNumber(0)
    };
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  public async derivedUpdate() {
    const ownRowsData = await this.props.getOwnRowsData;
    const tokenRowsData = this.props.getTokenRowsData;
    await this._isMounted && this.setState({ ...this.state, tokenRowsData: tokenRowsData, ownRowsData: ownRowsData });
  }

  public componentWillUnmount(): void {
    this._isMounted = false;

    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.removeListener(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }
  public componentWillMount(): void {
    this.derivedUpdate();
  }

  public componentDidMount(): void {
    this._isMounted = true;

    const e = this.state.tokenRowsData[0];

    this.props.onSelect(new TradeTokenKey(e.asset, e.defaultUnitOfAccount, e.positionType, e.defaultLeverage, e.defaultTokenizeNeeded));

    this.derivedUpdate();
  }

  public componentDidUpdate(prevProps: Readonly<ITradeTokenGridProps>, prevState: Readonly<ITradeTokenGridState>, snapshot?: any): void {
    if (this.props.isLong !== prevProps.isLong) {
      this._isMounted && this.setState({ ...this.state, tokenRowsData: this.props.getTokenRowsData });
    }

    if (this.props.selectedKey !== prevProps.selectedKey || this.props.showMyTokensOnly !== prevProps.showMyTokensOnly || this.state.ownRowsData !== prevState.ownRowsData) {
      this.derivedUpdate();
    }
  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }


  private renderDesktop = () => {
    let tokenRows;
    let tradeTokenGridProps = this.props;

    if (this.props.selectedKey.asset !== Asset.UNKNOWN) {
      tokenRows = this.state.tokenRowsData.map(e => <TradeTokenGridRow key={`${e.asset}_${e.positionType}`} {...e} onSelect={this.props.onSelect} onTrade={this.props.onTrade} />);
    }

    return (
      <div className="trade-token-grid__wrapper">
        <div className="trade-token-grid">
          <TradeTokenGridHeader showMyTokensOnly={this.props.showMyTokensOnly} />
          {tokenRows && tokenRows.map(row => {
            return (<div className="trade-token-grid-row-wrapper" key={`${row.props.asset}_${row.props.positionType}`}>
              {row}
              {this.state.ownRowsData
                .filter(e => e.currentKey.positionType === row.props.positionType)
                .map(() => <InnerOwnTokenGrid positionType={this.props.selectedKey.positionType} asset={this.props.selectedKey.asset} onManageCollateralOpen={this.props.onManageCollateralOpen} getOwnRowsData={this.props.getOwnRowsData} onSelect={this.props.onSelect} onTrade={this.props.onTrade} {...tradeTokenGridProps} />)}
            </div>)
          })}
        </div>
      </div>
    );
  }

  private renderMobile = () => {
    let tokenRowsMobile;
    let tradeTokenGridProps = this.props;
    if (this.props.isLong)
      tokenRowsMobile = this.state.tokenRowsData.filter(e => e.positionType === "LONG").map(e => <TradeTokenCardMobile key={`${e.asset}_${e.positionType}`} {...e} changeActiveBtn={this.props.changeActiveBtn} onSelect={this.props.onSelect} onTrade={this.props.onTrade} />);
    if (this.props.isShort)
      tokenRowsMobile = this.state.tokenRowsData.filter(e => e.positionType === "SHORT").map(e => <TradeTokenCardMobile key={`${e.asset}_${e.positionType}`} {...e} changeActiveBtn={this.props.changeActiveBtn} onSelect={this.props.onSelect} onTrade={this.props.onTrade} />);
    return (
      <div className="trade-token-card-mobile__wrapper">
        {tokenRowsMobile && tokenRowsMobile.map(row => {
          return (<div className="trade-token-grid-row-wrapper" key={`${row.props.asset}_${row.props.positionType}`}>
            {row}
            {this.state.ownRowsData
              .filter(e => e.currentKey.positionType === row.props.positionType)
              .map((e) => <InnerOwnTokenGrid key={`${e.currentKey.positionType}`} positionType={this.props.selectedKey.positionType} asset={this.props.selectedKey.asset} onManageCollateralOpen={this.props.onManageCollateralOpen} getOwnRowsData={this.props.getOwnRowsData} onSelect={this.props.onSelect} onTrade={this.props.onTrade} {...tradeTokenGridProps} />)}
          </div>)
        })}
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

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    await this.derivedUpdate();
  };
}
