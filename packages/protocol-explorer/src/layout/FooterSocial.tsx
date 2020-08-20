import React from "react";
import { ReactComponent as LogoSign } from "../assets/images/logo-sign.svg";
import { ReactComponent as LogoBzx } from "../assets/images/logo-bzx.svg";
import { ReactComponent as Github } from "../assets/images/github.svg";
import { ReactComponent as Twitter } from "../assets/images/twitter.svg";
import { ReactComponent as Telegram } from "../assets/images/telegram.svg";
import { ReactComponent as Discord } from "../assets/images/discord.svg";
import { ReactComponent as Medium } from "../assets/images/medium.svg";

interface IFooterSocialProps {
  isShowSocial: boolean;
}

export const FooterSocial = (props: IFooterSocialProps) => {
  return (
    <div className="footer-social">
      {props.isShowSocial && <div className="item-social">
        <div className="social">
          <a href="https://github.com/bZxNetwork" className="item-link"><Github /></a>
          <a href="https://medium.com/bzxnetwork" className="item-link"><Medium /></a>
          <a href="https://bzx.network/discord" className="item-link"><Discord /></a>
          <a href="https://t.me/b0xNet" className="item-link"><Telegram /></a>
          <a href="https://twitter.com/bzxHQ" className="item-link"><Twitter /></a>
        </div>
      </div>
      }
      <div className="item-social">
        <p className="data-protocol">Protocol explorer is built on the bZx protocol</p>
        <a href="https://bzx.network/" target="_blank" rel="noopener noreferrer" className="logo">
          <div className="wrapper-logo-sign">
            <LogoSign />
          </div>
          <LogoBzx />
        </a>
        <div className="flex data-year">
          <p className="light-gray-color">© {new Date().getFullYear()} bZeroX, LLC</p>
          <div className="flex">
            <a href="https://bzx.network/tos" target="_blank" rel="noopener noreferrer">Terms of use</a>
            <a href="https://bzx.network//privacy" target="_blank" rel="noopener noreferrer">Privacy policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
