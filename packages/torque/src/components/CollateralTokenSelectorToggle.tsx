import React, { Component, RefObject } from "react";
import { Asset } from "../domain/Asset";
import { AssetDetails } from "../domain/AssetDetails";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { CollateralTokenSelectorDlg } from "./CollateralTokenSelectorDlg";

export interface ICollateralTokenSelectorToggleProps {
  borrowAsset: Asset;
  collateralAsset: Asset;
  readonly: boolean;

  onChange: (value: Asset) => void;
}

interface IAssetSelectorItemState {
  assetDetails: AssetDetails | null;
}

export class CollateralTokenSelectorToggle extends Component<ICollateralTokenSelectorToggleProps, IAssetSelectorItemState> {
  private collateralTokenSelectorDlgRef: RefObject<CollateralTokenSelectorDlg>;

  constructor(props: ICollateralTokenSelectorToggleProps) {
    super(props);

    this.collateralTokenSelectorDlgRef = React.createRef();

    this.state = { assetDetails: null };
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentDidUpdate(
    prevProps: Readonly<ICollateralTokenSelectorToggleProps>,
    prevState: Readonly<IAssetSelectorItemState>,
    snapshot?: any
  ): void {
    if (this.props.collateralAsset !== prevProps.collateralAsset) {
      this.derivedUpdate();
    }
  }

  private derivedUpdate = async () => {
    const assetDetails = AssetsDictionary.assets.get(this.props.collateralAsset) || null;
    this.setState({ ...this.state, assetDetails: assetDetails });
  };

  public render() {
    if (this.state.assetDetails === null) {
      return null;
    }

    return (
      <React.Fragment>
        <CollateralTokenSelectorDlg ref={this.collateralTokenSelectorDlgRef} />
        <div className="collateral-token-selector-toggle">
          <div className="collateral-token-selector-toggle__logo-container">
            <img src={this.state.assetDetails.logoSvg} />
          </div>
          <div className="collateral-token-selector-toggle__info-container">
            <div className="collateral-token-selector-toggle__info-title">Collateral: {this.props.collateralAsset}</div>
            {this.props.readonly ? null : <div className="collateral-token-selector-toggle__change-action" onClick={this.onChangeClick}>Change</div>}
          </div>
        </div>
      </React.Fragment>
    );
  }

  private onChangeClick = async () => {
    if (this.collateralTokenSelectorDlgRef.current) {
      try {
        const collateralAsset = await this.collateralTokenSelectorDlgRef.current.getValue(this.props.borrowAsset, this.props.collateralAsset);
        this.props.onChange(collateralAsset);
      } finally {
        await this.collateralTokenSelectorDlgRef.current.hide();
      }
    }
  };
}
