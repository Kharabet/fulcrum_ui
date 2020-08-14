import React, { Component } from "react";
import { StatsTokenGrid } from "../components/StatsTokenGrid";
import { InfoBlock } from "../components/InfoBlock";

import "../styles/pages/_stats-page.scss"

export interface IStatsPageProps {
  doNetworkConnect: () => void;
  isRiskDisclosureModalOpen: () => void;
  isLoading: boolean;
  isMobileMedia: boolean;
}

interface IStatsPageState {
}

export default class StatsPage extends Component<IStatsPageProps, IStatsPageState> {
  constructor(props: any) {
    super(props);
  }
  private _isMounted: boolean = false;

  public componentWillUnmount(): void {
    this._isMounted = false;
  }

  public async componentDidMount() {
    this._isMounted = true;
  }

  public render() {
    return (
      <div className="stats-page">
        <main>
          <InfoBlock localstorageItemProp="defi-risk-notice">
            For your safety, please ensure the URL in your browser starts with: https://app.fulcrum.trade/. <br />
            Fulcrum is a non-custodial platform for tokenized lending and margin trading. <br />
            "Non-custodial" means YOU are responsible for the security of your digital assets. <br />
            To learn more about how to stay safe when using Fulcrum and other bZx products, please read our <button className="disclosure-link" onClick={this.props.isRiskDisclosureModalOpen}>DeFi Risk Disclosure</button>.
          </InfoBlock>
          <StatsTokenGrid isMobileMedia={this.props.isMobileMedia} />
        </main>
      </div>
    );
  }
}
