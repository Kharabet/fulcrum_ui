import React from 'react'
import { FooterMenu } from './FooterMenu'
import { FooterSocial } from './FooterSocial'

export const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="flex fw-w">
          <FooterSocial isShowSocial={true} />
          <FooterMenu />
        </div>
      </div>
    </footer>
  )
}
