import React, { ChangeEvent, Component } from "react";
import { CheckBox } from "./CheckBox";

export interface IOwnTokenGridHeaderProps {
  showMyTokensOnly: boolean;
  onShowMyTokensOnlyChange: (value: boolean) => void;
}

export class OwnTokenGridHeader extends Component<IOwnTokenGridHeaderProps> {
  public render() {
    return (
      <div className="own-token-grid-header">
        <div className="own-token-grid-header__col-token-image">
          <span className="own-token-grid-header__text">Asset</span>
        </div>
        <div className="own-token-grid-header__col-token-name-full">
          <span className="own-token-grid-header__text">&nbsp;</span>
        </div>
        <div className="own-token-grid-header__col-position-type">
          <span className="own-token-grid-header__text">&nbsp;</span>
        </div>
        <div className="own-token-grid-header__col-asset-price">
          <span className="own-token-grid-header__text">Unit of Account</span>
        </div>
        <div className="own-token-grid-header__col-asset-price">
          <span className="own-token-grid-header__text">Asset Price</span>
        </div>
        <div className="own-token-grid-header__col-liquidation-price">
          <span className="own-token-grid-header__text">Liquidation Price</span>
        </div>
        <div className="own-token-grid-header__col-position-value">
          <span className="own-token-grid-header__text">Position Value</span>
        </div>
        <div className="own-token-grid-header__col-profit">
          <span className="own-token-grid-header__text">Profit</span>
        </div>
        <div className="own-token-grid-header__col-actions">
          <span className="own-token-grid-header__text-right">
            <CheckBox checked={this.props.showMyTokensOnly} onChange={this.showMyTokensOnlyChange}>Show my positions only</CheckBox>
          </span>
        </div>
      </div>
    );
  }

  public showMyTokensOnlyChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.props.onShowMyTokensOnlyChange(event.target.checked);
  }
}
