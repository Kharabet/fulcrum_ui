import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { RefinanceAssetCompoundLoanItemMobile } from "./RefinanceAssetCompoundLoanItemMobile";
import {TorqueProvider} from "../services/TorqueProvider";
import {TorqueProviderEvents} from "../services/events/TorqueProviderEvents";
import {RefinanceCompoundData, IRefinanceLoan} from "../domain/RefinanceData";


export interface IRefinanceAssetCompoundLoanMobileProps {

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
    const sololoans = await TorqueProvider.Instance.getSoloLoans(); // TODO
    let soloLoans = loans.concat(sololoans);
    console.log("sololoans = ", sololoans);
    this.setState({ ...this.state, refinanceCompoundData: soloLoans });
  };


  public render() {
    const items = this.state.refinanceCompoundData.map((e, index) => (<RefinanceAssetCompoundLoanItemMobile key={index} {...e} />));

    return <div className="refinance-asset-selector">{items}</div>;
  }
}
