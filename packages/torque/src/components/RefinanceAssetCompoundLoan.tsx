import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { BigNumber } from "@0x/utils";
import { WalletType } from "../domain/WalletType";
import { RefinanceAssetCompoundLoanItem } from "./RefinanceAssetCompoundLoanItem";
import {TorqueProvider} from "../services/TorqueProvider";
import {TorqueProviderEvents} from "../services/events/TorqueProviderEvents";
import {IRefinanceLoan, RefinanceCompoundData} from "../domain/RefinanceData";


export interface IRefinanceAssetCompoundLoanProps {
  walletType: WalletType

  onSelectAsset?: (asset: Asset) => void;
}

interface IRefinanceCompoundSelectorItemState {
  asset:Asset,
  refinanceCompoundData: IRefinanceLoan[];
}

export class RefinanceAssetCompoundLoan extends Component<IRefinanceAssetCompoundLoanProps, IRefinanceCompoundSelectorItemState> {
  constructor(props: IRefinanceAssetCompoundLoanProps) {
    super(props);

    this.state = {
      asset: Asset.DAI,
      refinanceCompoundData:[]
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
    // const refinanceCompoundData = await TorqueProvider.Instance.checkSoloMargin();
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

            <RefinanceAssetCompoundLoanItem key={index} {...e}/>
          );

      });

    } else {
      // assetList = assetList.sort(e => this.assetsShown.get(e) ? -1 : 1);

        items = refinanceCompound.map((e, index) => {

          return (
            <RefinanceAssetCompoundLoanItem key={index} {...e}/>
          );

        });

    }

    return <div className="refinance-asset-selector">{items}</div>;

  }
}
