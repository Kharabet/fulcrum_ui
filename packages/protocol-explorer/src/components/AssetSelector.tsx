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
    this.assetsShown = [
      Asset.ETH,
      Asset.SAI,
      Asset.DAI,
      Asset.USDC,
      Asset.USDT,
      Asset.SUSD,
      Asset.WBTC,
      Asset.LINK,
      Asset.ZRX,
      Asset.REP,
      Asset.KNC
    ]
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
    /*const items = [
      { asset: Asset.ETH, name: 'eth', locked: 9.6, apr: 1.2 },
      { asset: Asset.DAI, name: 'dai', locked: 9.6, apr: 1.2 },
      { asset: Asset.SAI, name: 'sai', locked: 9.6, apr: 1.2 },
      { asset: Asset.REP, name: 'rep', locked: 9.6, apr: 1.2 },
      { asset: Asset.LINK, name: 'link', locked: 9.6, apr: 1.2 },
      { asset: Asset.USDT, name: 'usdt', locked: 9.6, apr: 1.2 },
      { asset: Asset.UNKNOWN, name: 'Attacker loan', locked: 9.6, apr: 1.2 }
        ];*/
    //const assetItems = items.map((e: IAssetSelectorItemProps) => <AssetSelectorItem key={e.name} {...e} />);
    //const assetItemsApi = this.state.itemsAsset.map((e: IAssetSelectorItemApiProps) => <AssetSelectorItemApi />);
    const assetItems = this.assetsShown.map(asset => <AssetSelectorItem key={asset} asset={asset} apr={this.state.apr} tvl={this.state.tvl} {...this.props} />)
    return <React.Fragment>
      <div className="asset-selector">{assetItems}</div>
    </React.Fragment>;
  }
  //let apr = +this.props.apr[`${this.props.asset.toLowerCase()}`];

  public componentDidMount(): void {
    this.getSupplyRateApr();
    this.getVaultBalance();
  }
}
