import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { WalletType } from "../domain/WalletType";
import { RefinanceAssetSelectorItem } from "./RefinanceAssetSelectorItem";
import { RefinanceAssetCompoundSelectorItem } from "./RefinanceAssetCompoundSelectorItem";
import {TorqueProvider} from "../services/TorqueProvider";
import {TorqueProviderEvents} from "../services/events/TorqueProviderEvents";
import { BigNumber } from "@0x/utils";
import {RefinanceCdpData, RefinanceData} from "../domain/RefinanceData";
// export interface IRefinanceAssetSelectorItemProps {
//   asset: Asset;
//   onSelectAsset?: (asset: Asset) => void;
// }
export interface IRefinanceAssetSelectorProps {
  walletType: WalletType
  // onSelectAsset?: (asset: Asset) => void;
}
interface IRefinanceAssetSelectorItemState {
  asset:Asset,
  isLoading:boolean;
  refinanceData: RefinanceCdpData[];
}

export class RefinanceAssetSelector extends Component<IRefinanceAssetSelectorProps,IRefinanceAssetSelectorItemState> {
  constructor(props: IRefinanceAssetSelectorProps) {
    super(props);
    this.state = {
      asset: Asset.DAI,
      isLoading:true,
      refinanceData:
      [{
        cdpId: new BigNumber(0),
        urn: '',
        ilk: '',
        accountAddress:'',
        proxyAddress:'',
        isProxy:false
      }]};
    console.log("this.state=  "+this.state)
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);

  }
  // true includes ENS support
  private readonly assetsShown: Map<Asset, boolean> = new Map<Asset, boolean>([
    [
      Asset.DAI,
      true
    ],
    // [
    //   Asset.DAI,
    //   false
    // ],
    // [
    //   Asset.USDC,
    //   true
    // ],
    // /*[
    //   Asset.SUSD,
    //   false
    // ],*/
    // [
    //   Asset.ETH,
    //   false
    // ],
    // [
    //   Asset.WBTC,
    //   false
    // ],
    // [
    //   Asset.LINK,
    //   false
    // ],
    // [
    //   Asset.ZRX,
    //   false
    // ],
    // [
    //   Asset.REP,
    //   false
    // ],
    // [
    //   Asset.KNC,
    //   false
    // ],
  ]);


  private onProviderAvailable = () => {

    this.derivedUpdate();
  };

  public componentDidMount(): void {
    this.derivedUpdate();
  }
  private derivedUpdate = async () => {
    const refinanceData = await TorqueProvider.Instance.checkCdp(Asset.DAI);
    if(refinanceData[0].cdpId.gt(0)){
      this.setState({ ...this.state, isLoading: false});
    }

    this.setState({ ...this.state, refinanceData: refinanceData});

  };


  public render() {

    let assetList = Array.from(this.assetsShown.keys());
    let refinance = this.state.refinanceData;

    let items;
    if (this.props.walletType === WalletType.Web3) {

      if(refinance[0].cdpId.gt(0)) {

        items = refinance.map((e, index) => {

          return (

            <RefinanceAssetSelectorItem key={this.state.refinanceData[index].urn} asset={Asset.DAI}
                                        cdpId={this.state.refinanceData[index].cdpId}
                                        urn={this.state.refinanceData[index].urn}
                                        accountAddress={this.state.refinanceData[index].accountAddress}
                                        proxyAddress={this.state.refinanceData[index].proxyAddress}
                                        isProxy={this.state.refinanceData[index].isProxy}
                                        ilk={this.state.refinanceData[index].ilk}/>
          );
        });
      }
    } else {
      assetList = assetList.sort(e => this.assetsShown.get(e) ? -1 : 1);
      if(refinance[0].cdpId != undefined) {
        if(refinance[0].cdpId.gt(0)) {

          items = refinance.map((e, index) => {

            return (
                <RefinanceAssetSelectorItem key={this.state.refinanceData[index].urn} asset={Asset.DAI}
                                          cdpId={this.state.refinanceData[index].cdpId}
                                          urn={this.state.refinanceData[index].urn}
                                          accountAddress={this.state.refinanceData[index].accountAddress}
                                          proxyAddress={this.state.refinanceData[index].proxyAddress}
                                          isProxy={this.state.refinanceData[index].isProxy}
                                          ilk={this.state.refinanceData[index].ilk}/>
            );
          });
        }
      }
    }
    return <div className="refinance-asset-selector">

          <div className="refinance-page__main-centeredOverlay" style={ !this.state.isLoading ? { display: `none`} : undefined}>
              <span>Loading...</span>
          </div>
      {items}
      </div>;
  }
}
