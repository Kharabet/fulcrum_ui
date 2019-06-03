import React, { PureComponent } from "react";
import { OpsSelector } from "../components/OpsSelector";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export class HomePage extends PureComponent {
  public render() {
    return (
      <div className="home-page">
        <HeaderHome />
        <main>
          <OpsSelector />
        </main>
        <Footer />
      </div>
    );
  }
}
