import React, { PureComponent } from "react";
import { Footer } from "../layout/Footer";
import { HeaderHome } from "../layout/HeaderHome";

export interface ILandingPageStaticProps {
  isRiskDisclosureModalOpen: () => void;
}

export class LandingPageStatic extends PureComponent<ILandingPageStaticProps> {
  public render() {
    return (
      <div className="landing-page-static">
        <HeaderHome isLoading={false} />
        <main className="landing-page-static__main">
          <div className="landing-page-static__jumbo">
            <h1>
              <span className="landing-page-static__jumbo-header">Borrowing Made Simple</span>
            </h1>
            <div className="landing-page-static_jumbo-action-container">
              {/*<ButtonLanding color={ButtonLandingColor.Blue} subtitle={"New user?"} title={"Borrow"} url={walletUrl} />
              <ButtonLanding color={ButtonLandingColor.Green} subtitle={"Existing user?"} title={"Track your loans"} url={trackLoansUrl} />*/}
            </div>
            <div dangerouslySetInnerHTML={{__html: '<style> #mc_embed_signup {  background: unset;  clear: left;  z-index: 10;  padding: 0.625rem;}#mc_embed_signup_scroll {  padding: 0.625rem;}#mce-EMAIL {  padding: 0.3125rem;  color: #3b364b;}#mc-embedded-subscribe {  padding: 0.3125rem;} </style> <div id="mc_embed_signup"><form action="https://network.us1.list-manage.com/subscribe/post?u=abb06950e3a65452b931c8069&amp;id=2878daa66b" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank" novalidate>    <div id="mc_embed_signup_scroll">	<label for="mce-EMAIL">Subscribe and get alerted when Torque goes live</label>	<input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address" required>    <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups-->    <div style="position: absolute; left: -5000px;" aria-hidden="true"><input type="text" name="b_abb06950e3a65452b931c8069_2878daa66b" tabindex="-1" value=""></div>    <div class="clear"><input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button"></div>    </div></form></div>'}} />
          </div>
        </main>
        <Footer isRiskDisclosureModalOpen={this.props.isRiskDisclosureModalOpen}/>
      </div>
    );
  }

  public componentDidMount(): void {
    const htmls = document.getElementsByTagName("html");
    this.addClass(htmls[0], "html-landing-page-static-active");
  }

  public componentWillUnmount(): void {
    const htmls = document.getElementsByTagName("html");
    this.removeClass(htmls[0], "html-landing-page-static-active");
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
