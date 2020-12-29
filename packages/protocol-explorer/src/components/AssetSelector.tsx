import React, { Component } from 'react'
import { AssetSelectorItem } from './AssetSelectorItem'
import Asset from 'bzx-common/src/assets/Asset'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import AssetDetails from 'bzx-common/src/assets/AssetDetails'
import { ExplorerProvider } from '../services/ExplorerProvider'

export interface IAssetSelectorProps {}

export interface IAssetSelectorState {
  apr: string | any
  tvl: Array<Object>
}

export class AssetSelector extends Component<IAssetSelectorProps, IAssetSelectorState> {
  private assetsShown: Asset[] = ExplorerProvider.Instance.assetsShown
  private apiUrl = 'https://api.bzx.network/v1'
  constructor(props: any) {
    super(props)
    this.state = {
      apr: [],
      tvl: []
    }
  }

  public getSupplyRateApr = async () => {
    const requestUrl = `${this.apiUrl}/supply-rate-apr`
    const response = await fetch(requestUrl)
    const responseJson = await response.json()
    !responseJson.success
      ? console.error(responseJson.message)
      : await this.setState({ ...this.state, apr: responseJson.data })
  }
  public getVaultBalance = async () => {
    const requestUrl = `${this.apiUrl}/vault-balance`
    const response = await fetch(requestUrl)
    const responseJson = await response.json()
    !responseJson.success
      ? console.error(responseJson.message)
      : await this.setState({ ...this.state, tvl: responseJson.data })
  }

  public render() {
    const assetItems = this.assetsShown.map((asset) => (
      <AssetSelectorItem
        key={asset}
        asset={asset}
        apr={this.state.apr}
        tvl={this.state.tvl}
        {...this.props}
      />
    ))
    return (
      <React.Fragment>
        <div className="asset-selector-container">{assetItems}</div>
      </React.Fragment>
    )
  }

  public componentDidMount(): void {
    this.getSupplyRateApr()
    this.getVaultBalance()
  }
}
