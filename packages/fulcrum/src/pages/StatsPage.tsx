import React, { PureComponent } from "react";
import { StatsTokenGrid } from "../components/StatsTokenGrid";
import { Footer } from "../layout/Footer";
import { HeaderOps } from "../layout/HeaderOps";
import { InfoBlock } from "../components/InfoBlock";
// import { FulcrumProviderEvents } from "../services/events/FulcrumProviderEvents";
// import { ProviderChangedEvent } from "../services/events/ProviderChangedEvent";
// import { FulcrumProvider } from "../services/FulcrumProvider";

export interface IStatsPageProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: ()  => void;
  isLoading: boolean;
  isMobileMedia: boolean;
}

interface IStatsPageState {
}

export class StatsPage extends PureComponent<IStatsPageProps, IStatsPageState> {
  constructor(props: any) {
    super(props);

    // FulcrumProvider.Instance.eventEmitter.on(FulcrumProviderEvents.ProviderChanged, this.onProviderChanged);
  }

  /*public componentDidMount(): void {
    if (!FulcrumProvider.Instance.web3Wrapper) {
      this.props.doNetworkConnect();
    }
  }*/

  public render() {
    return (
      <div className="stats-page">
        <HeaderOps isMobileMedia={this.props.isMobileMedia} isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
        <main>
          <InfoBlock localstorageItemProp="defi-risk-notice">
            For your safety, please ensure the URL in your browser starts with: https://app.fulcrum.trade/. <br />
            Fulcrum is a non-custodial platform for tokenized lending and margin trading. <br />
            "Non-custodial" means YOU are responsible for the security of your digital assets. <br />
            To learn more about how to stay safe when using Fulcrum and other bZx products, please read our <button className="disclosure-link" onClick={this.props.isRiskDisclosureModalOpen}>DeFi Risk Disclosure</button>.
          </InfoBlock>
          <StatsTokenGrid isMobileMedia={this.props.isMobileMedia} />
        </main>
        <Footer isMobileMedia={this.props.isMobileMedia} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
      </div>
    );
  }

  /*private onProviderChanged = async (event: ProviderChangedEvent) => {
    this.setState({ ...this.state, selectedKey: this.state.selectedKey, priceGraphData: priceGraphData });
  };*/
}
