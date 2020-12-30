import { BigNumber } from '@0x/utils'
import React, { Component } from 'react'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'

export interface IOpsEstimateResultProps {
  actionTitle: string
  assetDetails: AssetDetails
  amount: BigNumber
  precision: number
}

export class OpsEstimatedResult extends Component<IOpsEstimateResultProps> {
  public render() {
    let amount = this.props.amount
    if (amount.isNaN()) {
      amount = new BigNumber(0)
    }

    return (
      <div className="ops-estimated-result__operation-result-container">
        <img
          className="ops-estimated-result__operation-result-img"
          src={this.props.assetDetails.logoSvg}
        />
        <div className="ops-estimated-result__operation-result-msg">{this.props.actionTitle}</div>
        <div className="ops-estimated-result__operation-result-amount">
          {amount.toFixed(this.props.precision)} {this.props.assetDetails.displayName}
        </div>

        {this.props.children}
      </div>
    )
  }
}
