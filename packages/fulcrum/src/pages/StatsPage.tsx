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
        <HeaderOps isMobileMedia={this.props.isMobileMedia} isLoading={this.props.isLoading} doNetworkConnect={this.props.doNetworkConnect} />
        <main>
          <InfoBlock localstorageItemProp="defi-risk-notice">
            For your safety, please ensure the URL in your browser is: <a href="https://fulcrum.trade/" className="regular-link">https://fulcrum.trade/</a>. Fulcrum is a non-custodial platform for tokenized lending and margin trading. “Non-custodial” means YOU are responsible for the security of your digital assets. To learn more about how to stay safe when using bZx, please read our <a className="disclosure-link" href="">DeFi Risk Disclosure</a>
          </InfoBlock>
          <StatsTokenGrid isMobileMedia={this.props.isMobileMedia} />
        </main>
        <Footer isMobileMedia={this.props.isMobileMedia} />
      </div>
    );
  }

  /*private onProviderChanged = async (event: ProviderChangedEvent) => {
    this.setState({ ...this.state, selectedKey: this.state.selectedKey, priceGraphData: priceGraphData });
  };*/
}
