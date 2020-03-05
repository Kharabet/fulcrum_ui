import React, { Component, MouseEvent } from "react";
import {ReactComponent as IcTokenSelectorDown} from "../assets/images/ic___token_selector___down.svg";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";

export interface ICollateralTokenButtonProps {
  asset: Asset;
  isChangeCollateralOpen: boolean;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

interface ICollateralTokenButtonState {
  assetDetails: AssetDetails | undefined;
}

export class CollateralTokenButton extends Component<ICollateralTokenButtonProps, ICollateralTokenButtonState> {
  constructor(props: ICollateralTokenButtonProps) {
    super(props);

    this.state = { assetDetails: undefined };
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<ICollateralTokenButtonProps>,
    prevState: Readonly<ICollateralTokenButtonState>,
    snapshot?: any
  ): void {
    if (prevProps.asset !== this.props.asset) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = () => {
    const assetDetails = AssetsDictionary.assets.get(this.props.asset);
    this.setState({ ...this.state, assetDetails: assetDetails });
  };

  public render() {
    return (
      <React.Fragment>
        {this.state.assetDetails ? (
          <div className={`collateral-token-button ${this.props.isChangeCollateralOpen ? "opened" : "closed"}`} onClick={this.onClick}>
            {this.state.assetDetails.reactLogoSvg.render()}
            <span>{this.state.assetDetails.displayName}</span>  
          </div>
        ) : null}
      </React.Fragment>
    );
  }

  private onClick = (event: MouseEvent<HTMLDivElement>) => {
    this.props.onClick(event);
  };
}
