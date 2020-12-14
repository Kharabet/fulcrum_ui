import React, { Component } from 'react'
import Asset from 'bzx-common/src/assets/Asset'

import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'


export interface ITokenSpinnerProps {
  asset: Asset
}

export class TokenSpinner extends Component<ITokenSpinnerProps> {
  public render() {
    const asset = AssetsDictionary.assets.get(this.props.asset)
    if (!asset) {
      return null
    }

    return (
      <div className="token-spinner">
        <img className="token-spinner__img" src={asset.logoSvg} />
        <div className="token-spinner__spinner" />
      </div>
    )
  }
}
