import React, { PureComponent } from "react";
import { OpsSelector } from "../components/OpsSelector";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export interface IHomePageProps {
  isMobileMedia: boolean;
  isRiskDisclosureModalOpen: () => void;
}
export class HomePage extends PureComponent<IHomePageProps> {
  public render() {
    return (
      <div className="home-page">
        <HeaderHome />
        <main>
          <OpsSelector />
        </main>
        <Footer isMobileMedia={this.props.isMobileMedia} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
      </div>
    );
  }
}
