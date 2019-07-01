import React, { PureComponent } from "react";
import { ButtonLanding, ButtonLandingColor } from "../components/ButtonLanding";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export class LandingPage extends PureComponent {
  public render() {
    return (
      <div className="landing-page">
        <HeaderHome />
        <main className="landing-page__main">
          <div className="landing-page__jumbo">
            <h1>
              <span className="landing-page__jumbo-header">Borrowing Made Simple</span>
            </h1>
            <div className="landing-page__jumbo-action-container">
              <ButtonLanding color={ButtonLandingColor.Blue} subtitle={"New user?"} title={"Borrow"} url={"/borrow"} />
              <ButtonLanding color={ButtonLandingColor.Green} subtitle={"Existing user?"} title={"Select Wallet"} url={"/wallet"} />
            </div>
          </div>
        </main>
        <Footer />
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
    return !!ele.className.match(new RegExp("(\\s|^)" + cls + "(\\s|$)"));
  };

  private addClass = (ele: Element, cls: string) => {
    if (!this.hasClass(ele, cls)) ele.className += " " + cls;
  };

  private removeClass = (ele: Element, cls: string) => {
    if (this.hasClass(ele, cls)) {
      const reg = new RegExp("(\\s|^)" + cls + "(\\s|$)");
      ele.className = ele.className.replace(reg, " ");
    }
  };
}
