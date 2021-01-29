import React from 'react'
import { ReactComponent as Discord } from 'app-images/discord.svg'
import { ReactComponent as Github } from 'app-images/github.svg'
import { ReactComponent as LogoBzx } from 'app-images/logo-bzx.svg'
import { ReactComponent as LogoSign } from 'app-images/logo-sign.svg'
import { ReactComponent as Medium } from 'app-images/medium.svg'
import { ReactComponent as Telegram } from 'app-images/telegram.svg'
import { ReactComponent as Twitter } from 'app-images/twitter.svg'

interface IFooterSocialProps {
  isShowSocial: boolean
}

export function FooterSocial(props: IFooterSocialProps) {
  return (
    <div className="footer-social">
      {props.isShowSocial && (
        <div className="item-social">
          <div className="social">
            <a href="https://github.com/bZxNetwork" className="item-link">
              <Github />
            </a>
            <a href="https://medium.com/bzxnetwork" className="item-link">
              <Medium />
            </a>
            <a href="https://bzx.network/discord" className="item-link">
              <Discord />
            </a>
            <a href="https://t.me/b0xNet" className="item-link">
              <Telegram />
            </a>
            <a href="https://twitter.com/bzxHQ" className="item-link">
              <Twitter />
            </a>
          </div>
        </div>
      )}
      <div className="item-social">
        <p className="data-protocol">Stakers Dashboard is built on the bZx protocol</p>
        <a href="https://bzx.network/" target="_blank" rel="noopener noreferrer" className="logo">
          <div className="logo-sign">
            <LogoSign />
          </div>
          <div className="logo-bzx">
            <LogoBzx />
          </div>
        </a>
        <div className="flex data-year">
          <p className="light-gray-color">© {new Date().getFullYear()} bZeroX, LLC</p>
          <div className="flex-center">
            <a href="https://bzx.network/tos" target="_blank" rel="noopener noreferrer">
              Terms of use
            </a>
            <a href="https://bzx.network//privacy" target="_blank" rel="noopener noreferrer">
              Privacy policy
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default React.memo(FooterSocial)
