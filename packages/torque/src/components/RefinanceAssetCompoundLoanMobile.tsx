import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { BigNumber } from "@0x/utils";
import { WalletType } from "../domain/WalletType";
import { RefinanceAssetCompoundLoanItemMobile } from "./RefinanceAssetCompoundLoanItemMobile";
import {TorqueProvider} from "../services/TorqueProvider";
import {TorqueProviderEvents} from "../services/events/TorqueProviderEvents";
import {RefinanceCompoundData, IRefinanceLoan} from "../domain/RefinanceData";


export interface IRefinanceAssetCompoundLoanMobileProps {
  walletType: WalletType

  onSelectAsset?: (asset: Asset) => void;
}

interface IRefinanceCompoundSelectorItemState {
  asset:Asset,
  refinanceCompoundData: IRefinanceLoan[];
}

export class RefinanceAssetCompoundLoanMobile extends Component<IRefinanceAssetCompoundLoanMobileProps, IRefinanceCompoundSelectorItemState> {
  constructor(props: IRefinanceAssetCompoundLoanMobileProps) {
    super(props);
    this.state = {
      asset: Asset.DAI,
      refinanceCompoundData:
      []
    };
    // console.log("this.state=  "+this.state)
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.onProviderAvailable);

  }
  // true includes ENS support
  private onProviderAvailable = () => {

    this.derivedUpdate();
  };

  public componentDidMount(): void {
    this.derivedUpdate();
  }
  private derivedUpdate = async () => {
    const loans = await TorqueProvider.Instance.getCompoundLoans(); // TODO

    console.log('compound', loans);
    this.setState({ ...this.state, refinanceCompoundData: loans });

  };


  public render() {

    // let assetList = Array.from(this.assetsShown.keys());
    let refinanceCompound = this.state.refinanceCompoundData
    let items;
    if (this.props.walletType === WalletType.Web3) {
      items = refinanceCompound.map((e, index)  => {

          return (

            <RefinanceAssetCompoundLoanItemMobile key={index} {...e} />
          );

      });

    } else {
      // assetList = assetList.sort(e => this.assetsShown.get(e) ? -1 : 1);

        items = refinanceCompound.map((e, index) => {

          return (
            <RefinanceAssetCompoundLoanItemMobile key={index} {...e} />
          );

        });

    }

    return <div className="refinance-asset-selector">{items}</div>;

  }
}
