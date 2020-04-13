import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { IRefinanceLoan } from "../domain/RefinanceData";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { RefinanceAssetCompoundLoanItem } from "./RefinanceAssetCompoundLoanItem";

export interface IRefinanceAssetCompoundLoanProps {

  onSelectAsset?: (asset: Asset) => void;
}

interface IRefinanceCompoundSelectorItemState {
  asset: Asset,
  refinanceCompoundData: IRefinanceLoan[];
}

export class RefinanceAssetCompoundLoan extends Component<IRefinanceAssetCompoundLoanProps, IRefinanceCompoundSelectorItemState> {
  constructor(props: IRefinanceAssetCompoundLoanProps) {
    super(props);

    this.state = {
      asset: Asset.DAI,
      refinanceCompoundData: []
    };
    
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.derivedUpdate);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
  }

  public componentDidMount(): void {
    this.derivedUpdate();
  }

  public componentWillUnmount(): void{
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.derivedUpdate);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
  }

  private derivedUpdate = async () => {
    // const refinanceCompoundData = await TorqueProvider.Instance.checkSoloMargin();
    const loans = await TorqueProvider.Instance.getCompoundLoans(); // TODO

    if (loans.length) {
      console.log("compound", loans[0].balance.toString(10));
    }
    this.setState({ ...this.state, refinanceCompoundData: loans });
    const sololoans = await TorqueProvider.Instance.getSoloLoans(); // TODO
    let soloLoans = loans.concat(sololoans);
    console.log("sololoans = ", sololoans);
    this.setState({ ...this.state, refinanceCompoundData: soloLoans });
  };

  public render() {
    const items = this.state.refinanceCompoundData.map((e, index) => (<RefinanceAssetCompoundLoanItem key={index} {...e} />));

    return <div className="refinance-asset-selector">{items}</div>;
  }
}
