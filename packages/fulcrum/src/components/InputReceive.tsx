import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { AssetDropdown } from "./AssetDropdown";
import { BigNumber } from "@0x/utils";

interface IInputReceiveProps {
  receiveAmout: BigNumber;
  returnedAsset: Asset;
  assetDropdown: Asset[];
  getLoanCloseAmount: (asset: Asset) => void;
}

interface IInputReceiveState {
}

export class InputReceive extends Component<IInputReceiveProps, IInputReceiveState> {

  constructor(props: IInputReceiveProps) {
    super(props);
  }


  public render() {
    return (
      <React.Fragment>
        <div className="input-receive__title">You will Receive</div>
        <div className="input-receive__container">
          <div className="input-receive__input">
            {Number(this.props.receiveAmout.toFixed(5))}
          </div>
          <AssetDropdown
            selectedAsset={this.props.returnedAsset}
            onAssetChange={this.props.getLoanCloseAmount}
            assets={this.props.assetDropdown} />
        </div>
      </React.Fragment>
    );
  }
}