import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { RefinanceCdpData } from "../domain/RefinanceData";
import { WalletType } from "../domain/WalletType";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { RefinanceAssetSelectorItemMobile } from "./RefinanceAssetSelectorItemMobile";
// export interface IRefinanceAssetSelectorMobileItemProps {
//   asset: Asset;
//   onSelectAsset?: (asset: Asset) => void;
// }
export interface IRefinanceAssetSelectorMobileProps {
  walletType: WalletType
  // onSelectAsset?: (asset: Asset) => void;
}

interface IRefinanceAssetSelectorMobileItemState {
  asset: Asset,
  isLoading: boolean;
  isItems: boolean;
  isShowRecord: boolean;
  refinanceData: RefinanceCdpData[];
}

export class RefinanceAssetSelectorMobile extends Component<IRefinanceAssetSelectorMobileProps, IRefinanceAssetSelectorMobileItemState> {
  constructor(props: IRefinanceAssetSelectorMobileProps) {
    super(props);
    this.state = {
      asset: Asset.DAI,
      isLoading: true,
      isItems: true,
      isShowRecord: false,
      refinanceData:
        [{
          cdpId: new BigNumber(0),
          urn: "",
          ilk: "",
          accountAddress: "",
          proxyAddress: "",
          isProxy: false,
          isInstaProxy: false
        }]
    };
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);

  }

  // true includes ENS support
  private readonly assetsShown: Map<Asset, boolean> = new Map<Asset, boolean>([
    [
      Asset.DAI,
      true
    ]
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
    let isItem = false;
    this.setState({ ...this.state, isLoading: true, isItems: true });

    const refinanceData = await TorqueProvider.Instance.getMakerLoans();

    // tslint:disable-next-line
    for (let i = 0; i < refinanceData.length; i++) {
      if (refinanceData[i].cdpId.gt(0)) {
        isItem = true;
        window.setTimeout(() => {
          this.setState({ ...this.state, isLoading: false, isItems: true, isShowRecord: true });

        }, 1900);
      }
    }
    if (!isItem && !this.state.isLoading) {
      this.setState({ ...this.state, isItems: false });
    }

    if (refinanceData[0].cdpId.gt(0)) {
      window.setTimeout(() => {
        this.setState({ ...this.state, isLoading: false });

      }, 1900);
    } else {
      window.setTimeout(() => {
        this.setState({ ...this.state, isLoading: false });
        if (!isItem && !this.state.isLoading && !this.state.isShowRecord) {
          this.setState({ ...this.state, isItems: false });
        }
      }, 12000);
    }

    this.setState({ ...this.state, refinanceData: refinanceData });

  };


  public render() {

    const refinance = this.state.refinanceData;

    let items;
    if (this.props.walletType === WalletType.Web3) {

      if (refinance[0].cdpId.gt(0)) {

        items = refinance.map((e, index) => {

          return (
            <RefinanceAssetSelectorItemMobile key={this.state.refinanceData[index].urn} asset={Asset.DAI}
                                              cdpId={this.state.refinanceData[index].cdpId}
                                              urn={this.state.refinanceData[index].urn}
                                              accountAddress={this.state.refinanceData[index].accountAddress}
                                              proxyAddress={this.state.refinanceData[index].proxyAddress}
                                              isProxy={this.state.refinanceData[index].isProxy}
                                              isInstaProxy={this.state.refinanceData[index].isInstaProxy}
                                              ilk={this.state.refinanceData[index].ilk}/>
          );

        });
      }
    } else {
      if (refinance[0].cdpId !== undefined) {
        if (refinance[0].cdpId.gt(0)) {

          items = refinance.map((e, index) => {

            return (
              <RefinanceAssetSelectorItemMobile key={this.state.refinanceData[index].urn} asset={Asset.DAI}
                                                cdpId={this.state.refinanceData[index].cdpId}
                                                urn={this.state.refinanceData[index].urn}
                                                accountAddress={this.state.refinanceData[index].accountAddress}
                                                proxyAddress={this.state.refinanceData[index].proxyAddress}
                                                isProxy={this.state.refinanceData[index].isProxy}
                                                isInstaProxy={this.state.refinanceData[index].isInstaProxy}
                                                ilk={this.state.refinanceData[index].ilk}/>
            );

          });
        }
      }
    }

    return <div className="refinance-asset-selector">

      <div className="refinance-page__main-centeredOverlay"
           style={!this.state.isLoading ? { display: `none` } : undefined}>
        <span>Loading...</span>
      </div>
      <div className="refinance-page__main-msgCentered" onClick={this.derivedUpdate}
           style={this.state.isItems ? { display: `none` } : undefined}>
        <span>Looks like you don't have any loans available to refinance.</span>
      </div>
      {items}
    </div>;
  }
}
