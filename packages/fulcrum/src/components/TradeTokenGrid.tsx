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
import { OwnTokenGrid } from "./OwnTokenGrid";

// import siteConfig from "./../config/SiteConfig.json";

export interface ITradeTokenGridProps {
  selectedTabAsset: Asset;
  isMobileMedia: boolean;
  changeActiveBtn: (activeType: string) => void;
  isLong: boolean;
  isShort: boolean;
  tokenRowsData: ITradeTokenGridRowProps[];
  ownRowsData: IOwnTokenGridRowProps[];
}

interface ITradeTokenGridState {
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {

  constructor(props: ITradeTokenGridProps) {
    super(props);

    this._isMounted = false;
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

  public componentDidUpdate(prevProps: Readonly<ITradeTokenGridProps>, prevState: Readonly<ITradeTokenGridState>, snapshot?: any): void {
    if (this.props.selectedTabAsset !== prevProps.selectedTabAsset) {
      this.derivedUpdate();
    }
  }

  public render() {
    return !this.props.isMobileMedia ? this.renderDesktop() : this.renderMobile();
  }


  private renderDesktop = () => {
    let tokenRows;

    if (this.props.selectedTabAsset !== Asset.UNKNOWN) {
      tokenRows = this.props.tokenRowsData.map(e => <TradeTokenGridRow key={`${e.asset}_${e.positionType}`} {...e} />);
    }

    return (
      <div className="trade-token-grid__wrapper">
        <div className="trade-token-grid">
          <TradeTokenGridHeader />
          {tokenRows && tokenRows.map(row => {
            return (<div className="trade-token-grid-row-wrapper" key={`${row.props.asset}_${row.props.positionType}`}>
              {row}
              <InnerOwnTokenGrid
                ownRowsData={this.props.ownRowsData
                  .filter(e => e.currentKey.positionType === row.props.positionType && e.currentKey.asset === row.props.asset)}
                isMobileMedia={this.props.isMobileMedia}
              />
            </div>)
          })}
        </div>
      </div>
    );
  }

  private renderMobile = () => {
    let tokenRowsMobile;
    if (this.props.isLong)
      tokenRowsMobile = this.props.tokenRowsData.filter(e => e.positionType === "LONG").map(e => <TradeTokenCardMobile key={`${e.asset}_${e.positionType}`} {...e} changeActiveBtn={this.props.changeActiveBtn} />);
    if (this.props.isShort)
      tokenRowsMobile = this.props.tokenRowsData.filter(e => e.positionType === "SHORT").map(e => <TradeTokenCardMobile key={`${e.asset}_${e.positionType}`} {...e} changeActiveBtn={this.props.changeActiveBtn} />);
    return (
      <div className="trade-token-card-mobile__wrapper">
        {tokenRowsMobile && tokenRowsMobile.map(row => {
          return (<div className="trade-token-grid-row-wrapper" key={`${row.props.asset}_${row.props.positionType}`}>
            {row}
            <InnerOwnTokenGrid
                ownRowsData={this.props.ownRowsData
                  .filter(e => e.currentKey.positionType === row.props.positionType && e.currentKey.asset === row.props.asset)}
                isMobileMedia={this.props.isMobileMedia}
              />
          </div>)
        })}
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
