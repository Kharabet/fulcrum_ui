import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import Asset from 'bzx-common/src/assets/Asset'

import { AssetDropdown } from './AssetDropdown'

interface IInputReceiveProps {
  receiveAmout: BigNumber
  returnedAsset: Asset
  assetDropdown: Asset[]
  getLoanCloseAmount: (asset: Asset) => void
}

interface IInputReceiveState {}

export default class InputReceive extends Component<IInputReceiveProps, IInputReceiveState> {
  constructor(props: IInputReceiveProps) {
    super(props)
  }

  public render() {
    return (
      <React.Fragment>
        <div className="input-receive__title">You will Receive</div>
        <div className="input-receive__container">
          <div title={this.props.receiveAmout.toFixed(18)} className="input-receive__input">
            {Number(this.props.receiveAmout.toFixed(5))}
          </div>
          <AssetDropdown
            selectedAsset={this.props.returnedAsset}
            onAssetChange={this.props.getLoanCloseAmount}
            assets={this.props.assetDropdown}
          />
        </div>
      </React.Fragment>
    )
  }
}
