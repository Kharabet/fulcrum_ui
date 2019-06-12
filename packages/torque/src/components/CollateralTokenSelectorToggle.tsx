import React, { Component, RefObject } from "react";
import { Asset } from "../domain/Asset";
import { CollateralTokenSelectorDlg } from "./CollateralTokenSelectorDlg";

export interface ICollateralTokenSelectorToggleProps {
  collateralAsset: Asset;
  readonly: boolean;

  onChange: (value: Asset) => void;
}

export class CollateralTokenSelectorToggle extends Component<ICollateralTokenSelectorToggleProps> {
  private collateralTokenSelectorDlgRef: RefObject<CollateralTokenSelectorDlg>;

  public constructor(props: ICollateralTokenSelectorToggleProps, context?: any) {
    super(props, context);

    this.collateralTokenSelectorDlgRef = React.createRef();
  }

  public render() {
    return (
      <React.Fragment>
        <CollateralTokenSelectorDlg ref={this.collateralTokenSelectorDlgRef} />
        <div>
          <div>
            <img />
          </div>
          <div>
            <div>Collateral: {this.props.collateralAsset}</div>
            {this.props.readonly ? null : <div onClick={this.onChangeClick}>Change</div>}
          </div>
        </div>
      </React.Fragment>
    );
  }

  private onChangeClick = async () => {
    if (this.collateralTokenSelectorDlgRef.current) {
      try {
        const collateralAsset = await this.collateralTokenSelectorDlgRef.current.getValue(this.props.collateralAsset);
        this.props.onChange(collateralAsset);
      } finally {
        await this.collateralTokenSelectorDlgRef.current.hide();
      }
    }
  };
}
