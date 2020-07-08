import React from "react";
import { ReactComponent as LogoBzx } from "../assets/images/logo-bzx.svg";
import { ReactComponent as Github } from "../assets/images/github.svg";
import { ReactComponent as Twitter } from "../assets/images/twitter.svg";
import { ReactComponent as Telegram } from "../assets/images/telegram.svg";
import { ReactComponent as Discord } from "../assets/images/discord.svg";

interface IFooterSocialProps {
  isShowSocial: boolean;
}

export const FooterSocial = (props: IFooterSocialProps) => {
  return (
    <div className="footer-social">
      {props.isShowSocial && <div className="item-social">
        <div className="social">
          <a href="https://github.com/bZxNetwork" className="item-link"><Github /></a>
          <a href="https://bzx.network/discord" className="item-link"><Discord /></a>
          <a href="https://t.me/b0xNet" className="item-link"><Telegram /></a>
          <a href="https://twitter.com/bzxHQ" className="item-link"><Twitter /></a>
        </div>
      </div>
      }
      <div className="item-social">
        <p className="data-protocol">Torque is built on the bZx protocol</p>
        <a href="https://bzx.network/" target="_blank" className="logo">
          <LogoBzx />
        </a>
        <div className="flex data-year">
          <p className="light-gray-color">© {new Date().getFullYear()} bZeroX, LLC</p>
          <div className="flex">
            <a href="/tos">Terms of use</a>
            <a href="/privacy">Privacy policy</a>
          </div>
        </div>
      </div>
    </div>
  );
}
