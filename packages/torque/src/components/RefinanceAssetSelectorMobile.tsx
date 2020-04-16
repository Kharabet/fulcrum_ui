import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { RefinanceCdpData } from "../domain/RefinanceData";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { RefinanceAssetSelectorItemMobile } from "./RefinanceAssetSelectorItemMobile";
import { Loader } from "./Loader";
// export interface IRefinanceAssetSelectorMobileItemProps {
//   asset: Asset;
//   onSelectAsset?: (asset: Asset) => void;
// }
export interface IRefinanceAssetSelectorMobileProps {
  updateStateShowLoader: (value: any) => void
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

    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.derivedUpdate);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  componentWillUnmount(): void{
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.derivedUpdate);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
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

  public componentDidUpdate(prevState: any) {
    if (this.state.isLoading !== prevState.isLoading) {
      this.props.updateStateShowLoader(this.state.isLoading);
    }
  }

  public render() {
    const refinance = this.state.refinanceData;
    let items;
    if (refinance[0].cdpId.gt(0)) {
      items = refinance.map((e, index) => {
        return (
          <RefinanceAssetSelectorItemMobile
            key={this.state.refinanceData[index].urn} asset={Asset.DAI}
            cdpId={this.state.refinanceData[index].cdpId}
            urn={this.state.refinanceData[index].urn}
            accountAddress={this.state.refinanceData[index].accountAddress}
            proxyAddress={this.state.refinanceData[index].proxyAddress}
            isProxy={this.state.refinanceData[index].isProxy}
            isInstaProxy={this.state.refinanceData[index].isInstaProxy}
            ilk={this.state.refinanceData[index].ilk} />
        );
      });
    }

    return <div className="refinance-asset-selector">
      <div className="refinance-page__main-msgCentered" onClick={this.derivedUpdate}
        style={this.state.isItems ? { display: `none` } : undefined}>
        <span>Looks like you don't have any loans available to refinance.</span>
      </div>
      {items}
    </div>;
  }
}
