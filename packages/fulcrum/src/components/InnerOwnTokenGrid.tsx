import React, { Component } from "react";
import { ManageCollateralRequest } from "../domain/ManageCollateralRequest";
import { TradeRequest } from "../domain/TradeRequest";
import { TradeTokenKey } from "../domain/TradeTokenKey";
import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
import { TradeTransactionMinedEvent } from "../services/events/TradeTransactionMinedEvent";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { InnerOwnTokenGridHeader } from "./InnerOwnTokenGridHeader";
import { IInnerOwnTokenGridRowProps, InnerOwnTokenGridRow } from "./InnerOwnTokenGridRow";
import { OwnTokenCardMobile } from "./OwnTokenCardMobile";
import { TradeType } from "../domain/TradeType";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { BigNumber } from "@0x/utils";

export interface IInnerOwnTokenGridProps {
  showMyTokensOnly: boolean;
  selectedKey: TradeTokenKey;

  asset?: Asset;
  positionType?: PositionType;
  onSelect: (key: TradeTokenKey) => void;
  onTrade: (request: TradeRequest) => void;
  onManageCollateralOpen: (request: TradeRequest) => void;
  isMobileMedia: boolean;
  getOwnRowsData: Promise<IInnerOwnTokenGridRowProps[]>;
}

interface IInnerOwnTokenGridState {
  innerOwnRowsData: IInnerOwnTokenGridRowProps[];
  isShowHistory: boolean;
}

export class InnerOwnTokenGrid extends Component<IInnerOwnTokenGridProps, IInnerOwnTokenGridState> {
  constructor(props: IInnerOwnTokenGridProps) {
    super(props);
    this._isMounted = false;
    this.state = {
      innerOwnRowsData: [],
      isShowHistory: false
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);

    this.onShowHistory = this.onShowHistory.bind(this);
    this.onShowOpenPositions = this.onShowOpenPositions.bind(this);
  }

  private _isMounted: boolean;

  public async derivedUpdate() {
    const innerOwnRowsData = await this.props.getOwnRowsData;

    this._isMounted && this.setState({ ...this.state, innerOwnRowsData: innerOwnRowsData });
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
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<IInnerOwnTokenGridProps>,
    prevState: Readonly<IInnerOwnTokenGridState>,
    snapshot?: any
  ): void {
    if (
      this.props.selectedKey !== prevProps.selectedKey ||
      this.props.showMyTokensOnly !== prevProps.showMyTokensOnly ||
      this.state.innerOwnRowsData !== prevState.innerOwnRowsData
    ) {
      this.derivedUpdate();
    }
  }

  public render() {

    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();

  }

  private renderDesktop = () => {
    const innerOwnRowsData = this.state.innerOwnRowsData.map(e => <InnerOwnTokenGridRow onManageCollateralOpen={this.props.onManageCollateralOpen} key={`${e.currentKey.toString()}`}  {...e} onSelect={this.props.onSelect} onTrade={this.props.onTrade} />);
    if (innerOwnRowsData.length === 0) return null;

    return (
      <div className="own-token-grid-inner">
        <InnerOwnTokenGridHeader />
        {innerOwnRowsData}
      </div>
    );
  }

  private renderMobile = () => {
    const innerOwnRowsData = this.state.innerOwnRowsData.map(e => <OwnTokenCardMobile key={`${e.currentKey.toString()}`} {...e} onSelect={this.props.onSelect} onTrade={this.props.onTrade} />);
    if (innerOwnRowsData.length === 0) return null;

    return (
      <div className="own-token-cards">
        <div className="own-token-cards__header">Manage</div>
        <div className="own-token-cards__container">
          {innerOwnRowsData}
        </div>

      </div>
    );
  }
  public onSellClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();

    this.props.onTrade(
      new TradeRequest(
        TradeType.SELL,
        this.props.selectedKey.asset,
        this.props.selectedKey.unitOfAccount,
        this.props.selectedKey.positionType === PositionType.SHORT ? this.props.selectedKey.asset : Asset.USDC,
        this.props.selectedKey.positionType,
        this.props.selectedKey.leverage,
        new BigNumber(0),
        this.props.selectedKey.isTokenized,
        this.props.selectedKey.version
      )
    );
  };

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    await this.derivedUpdate();
  };
  private onShowHistory = () => {
    this._isMounted && this.setState({ ...this.state, isShowHistory: true });
  };

  private onShowOpenPositions = () => {
    this._isMounted && this.setState({ ...this.state, isShowHistory: false });
  };
}
