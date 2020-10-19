import React, { Component } from "react";
import { AssetSelectorItem } from "./AssetSelectorItem";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { AssetDetails } from "../domain/AssetDetails";

export interface IAssetSelectorProps {
}

export interface IAssetSelectorState {
  apr: string | any,
  tvl: Array<Object>,

}

export class AssetSelector extends Component<IAssetSelectorProps, IAssetSelectorState> {
  private assetsShown: Asset[];
  private apiUrl = "https://api.bzx.network/v1";
  constructor(props: any) {
    super(props);
    this.state = {
      apr: [],
      tvl: []
    };
    if (process.env.REACT_APP_ETH_NETWORK === "mainnet") {
      this.assetsShown = [
        Asset.ETH,
        Asset.DAI,
        Asset.USDC,
        Asset.USDT,
        Asset.WBTC,
        Asset.LINK,
        Asset.YFI,
        Asset.BZRX,
        Asset.MKR,
        Asset.LEND,
        Asset.KNC
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "kovan") {
      this.assetsShown = [
        Asset.USDC,
        Asset.fWETH,
        Asset.WBTC
      ];
    } else if (process.env.REACT_APP_ETH_NETWORK === "ropsten") {
      this.assetsShown = [
        Asset.DAI,
        Asset.ETH,
      ];
    } else {
      this.assetsShown = [];
    }
  }


  public getSupplyRateApr = async () => {
    const requestUrl = `${this.apiUrl}/supply-rate-apr`;
    const response = await fetch(requestUrl);
    const responseJson = await response.json();
    (!responseJson.success)
      ? console.error(responseJson.message)
      : await this.setState({ ...this.state, apr: responseJson.data });
  }
  public getVaultBalance = async () => {
    const requestUrl = `${this.apiUrl}/vault-balance`;
    const response = await fetch(requestUrl);
    const responseJson = await response.json();
    (!responseJson.success)
      ? console.error(responseJson.message)
      : await this.setState({ ...this.state, tvl: responseJson.data });
  }

  public render() {
    const assetItems = this.assetsShown.map(asset => <AssetSelectorItem key={asset} asset={asset} apr={this.state.apr} tvl={this.state.tvl} {...this.props} />)
    return <React.Fragment>
      <div className="asset-selector-container">{assetItems}</div>
    </React.Fragment>;
  }

  public componentDidMount(): void {
    this.getSupplyRateApr();
    this.getVaultBalance();
  }
}
