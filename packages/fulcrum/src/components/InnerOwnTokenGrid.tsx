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
import { TradeType } from "../domain/TradeType";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { BigNumber } from "@0x/utils";
import { InnerOwnTokenCardMobile } from "./InnerOwnTokenCardMobile"; 
import { throwIfEmpty } from "rxjs/operators";

export interface IInnerOwnTokenGridProps { 
  isMobileMedia: boolean;
  ownRowsData: IInnerOwnTokenGridRowProps[];
}

interface IInnerOwnTokenGridState {
}

export class InnerOwnTokenGrid extends Component<IInnerOwnTokenGridProps, IInnerOwnTokenGridState> {
  constructor(props: IInnerOwnTokenGridProps) {
    super(props);
    this._isMounted = false;
    this.state = {
    };

    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
    FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.TradeTransactionMined, this.onTradeTransactionMined);
  }

  private _isMounted: boolean;

  public async derivedUpdate() {
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
  }

  public render() {

    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();

  }

  private renderDesktop = () => {
    const innerOwnRowsData = this.props.ownRowsData.map(e => <InnerOwnTokenGridRow key={`${e.currentKey.toString()}`}  {...e} />);
    if (innerOwnRowsData.length === 0) return null;

    return (
      <div className="inner-own-token-grid">
        <InnerOwnTokenGridHeader asset={this.props.ownRowsData[0].currentKey.asset} />
        {innerOwnRowsData}
      </div>
    );
  }

  private renderMobile = () => {
    const innerOwnRowsDataMobile = this.props.ownRowsData.map(e => <InnerOwnTokenCardMobile key={`${e.currentKey.toString()}`} {...e} />);
    if (innerOwnRowsDataMobile.length === 0) return null;

    return (
      <div className="inner-own-token-grid">
        {innerOwnRowsDataMobile}
      </div>
    );
  }
  

  private onProviderChanged = async (event: ProviderChangedEvent) => {
    await this.derivedUpdate();
  };

  private onTradeTransactionMined = async (event: TradeTransactionMinedEvent) => {
    await this.derivedUpdate();
  };
}
