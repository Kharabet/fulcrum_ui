import React, { PureComponent } from "react";
import { Link } from "react-router-dom";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export interface ILandingPageProps {
  isMobileMedia: boolean;
  isRiskDisclosureModalOpen: () => void;
}

export class LandingPage extends PureComponent<ILandingPageProps> {
  public render() {
    return (
      <div className="landing-page">
        <HeaderHome />
        <main className="landing-page__main">
          <div className="landing-page__jumbo">
            <h1><span className="landing-page__jumbo-header">Margin made simple</span></h1>
            <div className="landing-page__jumbo-action-container">
              <div className="landing-page__jumbo-action">
                <Link className="landing-page__jumbo-action-button" to="/lend">Lend</Link>
                <div className="landing-page__jumbo-action-description">TO EARN INTEREST</div>
              </div>

              <div className="landing-page__jumbo-action">
                <Link className="landing-page__jumbo-action-button" to="/trade">Trade</Link>
                <div className="landing-page__jumbo-action-description">WITH UP TO 5X LEVERAGE</div>
              </div>

            </div>
          </div>
        </main>
        <Footer isMobileMedia={this.props.isMobileMedia} isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen} />
      </div>
    );
  }

  public componentDidMount(): void {
    const htmls = document.getElementsByTagName("html");
    this.addClass(htmls[0], "html-landing-page-active");
  }

  public componentWillUnmount(): void {
    const htmls = document.getElementsByTagName("html");
    this.removeClass(htmls[0], "html-landing-page-active");
  }

  private hasClass = (ele: Element, cls: string) => {
    return !!ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  };

  private addClass = (ele: Element, cls: string) => {
    if (!this.hasClass(ele,cls)) ele.className += " "+cls;
  };

  private removeClass = (ele: Element, cls: string) => {
    if (this.hasClass(ele,cls)) {
      const reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
    }
  };

}
