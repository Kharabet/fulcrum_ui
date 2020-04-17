import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { PositionType } from "../domain/PositionType";
import { TradeTokenGridHeader } from "./TradeTokenGridHeader";
import { ITradeTokenGridRowProps, TradeTokenGridRow } from "./TradeTokenGridRow";
import { TradeTokenCardMobile } from "./TradeTokenCardMobile";
import { InnerOwnTokenGrid } from "./InnerOwnTokenGrid";
import { IOwnTokenGridRowProps } from "./OwnTokenGridRow";

export interface ITradeTokenGridProps {
  selectedTabAsset: Asset;
  isMobileMedia: boolean;
  tokenRowsData: ITradeTokenGridRowProps[];
  ownRowsData: IOwnTokenGridRowProps[];
}

interface ITradeTokenGridState {
  positionType: PositionType;
}

export class TradeTokenGrid extends Component<ITradeTokenGridProps, ITradeTokenGridState> {

  constructor(props: ITradeTokenGridProps) {
    super(props);
    this._isMounted = false;
    this.state = {
      positionType: PositionType.LONG
    }
  }

  private _isMounted: boolean;

  public componentDidMount(): void {
    this._isMounted = true;
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
    const tokenRowsMobile = this.props.tokenRowsData
    .filter(e => e.positionType === this.state.positionType)
    .map(e => <TradeTokenCardMobile key={`${e.asset}_${e.positionType}`} {...e} changeGridPositionType={this.changeGridPositionType} />);

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

  private changeGridPositionType= async (positionType: PositionType) =>{
    await this._isMounted && this.setState({...this.state, positionType: positionType})
  } 
}
