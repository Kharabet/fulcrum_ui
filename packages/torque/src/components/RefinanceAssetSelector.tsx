import { BigNumber } from "@0x/utils";
import React, { Component } from "react";
import { Asset } from "../domain/Asset";
import { RefinanceCdpData, IRefinanceLoan } from "../domain/RefinanceData";
import { TorqueProviderEvents } from "../services/events/TorqueProviderEvents";
import { TorqueProvider } from "../services/TorqueProvider";
import { RefinanceAssetSelectorItem } from "./RefinanceAssetSelectorItem";
import { Loader } from "./Loader";
import { ProviderType } from "../domain/ProviderType";
import { RefinanceAssetCompoundLoanItem } from "./RefinanceAssetCompoundLoanItem";

export interface IRefinanceAssetSelectorProps {
  isMobileMedia: boolean;
  doNetworkConnect: () => void;
  updateStateShowLoader: (value: any) => void
}

interface IRefinanceAssetSelectorItemState {
  asset: Asset,
  isLoading: boolean;
  isItems: boolean;
  isShowRecord: boolean;
  refinanceData: RefinanceCdpData[];
  refinanceCompoundData: IRefinanceLoan[];
}

export class RefinanceAssetSelector extends Component<IRefinanceAssetSelectorProps, IRefinanceAssetSelectorItemState> {
  constructor(props: IRefinanceAssetSelectorProps) {
    super(props);
    this.state = {
      asset: Asset.DAI,
      isLoading: true,
      isItems: true,
      isShowRecord: false,
      refinanceCompoundData: [],
      refinanceData:
        [{
          cdpId: new BigNumber(0),
          urn: "",
          ilk: "",
          accountAddress: "",
          proxyAddress: "",
          isProxy: false,
          isInstaProxy: false,
        }]
    };

    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderAvailable, this.derivedUpdate);
    TorqueProvider.Instance.eventEmitter.on(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
  }

  public componentDidMount(): void {
    // noinspection JSIgnoredPromiseFromCall
    this.derivedUpdate();
  }

  public componentWillUnmount(): void {
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderAvailable, this.derivedUpdate);
    TorqueProvider.Instance.eventEmitter.removeListener(TorqueProviderEvents.ProviderChanged, this.derivedUpdate);
  }

  private derivedUpdate = async () => {
    if (TorqueProvider.Instance.providerType === ProviderType.None || !TorqueProvider.Instance.contractsSource || !TorqueProvider.Instance.contractsSource.canWrite) {
      this.props.doNetworkConnect()
      return;
    }
    this.setState({ ...this.state, isLoading: true, isItems: false });
    const refinanceData = await this.getMakerRefinanceData()
    const refinanceCompoundData = await this.getSoloComoundRefinanceData();

    this.setState({ ...this.state,  isLoading: false, isItems: refinanceData.length > 0 || refinanceCompoundData.length > 0,refinanceData, refinanceCompoundData });
  };

  private getSoloComoundRefinanceData = async (): Promise<IRefinanceLoan[]> => {
    // const refinanceCompoundData = await TorqueProvider.Instance.checkSoloMargin();
    const loans = await TorqueProvider.Instance.getCompoundLoans(); // TODO

    if (loans.length) {
      console.log("compound", loans[0].balance.toString(10));
    }
    this.setState({ ...this.state, refinanceCompoundData: loans });

    const sololoans = await TorqueProvider.Instance.getSoloLoans(); // TODO
    console.log("sololoans = ", sololoans);

    const refinanceData = loans.concat(sololoans)
    return refinanceData;

  }
  private getMakerRefinanceData = async (): Promise<RefinanceCdpData[]> => {
    // let isItem = false;
    // this.setState({ ...this.state, isLoading: true, isItems: true });

    const refinanceData = await TorqueProvider.Instance.getMakerLoans();

    // tslint:disable-next-line:prefer-for-of
    // for (let i = 0; i < refinanceData.length; i++) {
    //   if (refinanceData[i].cdpId.gt(0)) {
    //     isItem = true;
    //     window.setTimeout(() => {
    //       this.setState({ ...this.state, isLoading: false, isItems: true, isShowRecord: true });

    //     }, 1900);
    //   }
    // }
    // if (!isItem && !this.state.isLoading) {
    //   this.setState({ ...this.state, isItems: false });
    // }

    // if (refinanceData[0].cdpId.gt(0)) {
    //   window.setTimeout(() => {
    //     this.setState({ ...this.state, isLoading: false });

    //   }, 1900);
    // } else {
    //   window.setTimeout(() => {
    //     this.setState({ ...this.state, isLoading: false });
    //     if (!isItem && !this.state.isLoading && !this.state.isShowRecord) {
    //       this.setState({ ...this.state, isItems: false });
    //     }
    //   }, 12000);
    // }

    return refinanceData;
  }

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
          <RefinanceAssetSelectorItem
            isMobileMedia={this.props.isMobileMedia}
            key={refinance[index].urn} asset={Asset.DAI}
            cdpId={refinance[index].cdpId}
            urn={refinance[index].urn}
            accountAddress={refinance[index].accountAddress}
            proxyAddress={refinance[index].proxyAddress}
            isProxy={refinance[index].isProxy}
            isInstaProxy={refinance[index].isInstaProxy}
            ilk={refinance[index].ilk} />
        );
      });
    }
    const soloCompoundItems = this.state.refinanceCompoundData.map((e, index) => (<RefinanceAssetCompoundLoanItem key={index} {...e} isMobileMedia={this.props.isMobileMedia} />));


    return <React.Fragment>
      {soloCompoundItems}
      {items}
      </React.Fragment>;
  }
}
