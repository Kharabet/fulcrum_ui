import React from 'react'
import FooterMenu from './FooterMenu'
import FooterSocial from 'shared-components/FooterSocial'

export function Footer() {
  return (
    <footer>
      <div className="container container-md">
        <div className="flex fw-w">
          <FooterSocial isShowSocial={true} />
          <FooterMenu />
        </div>
      </div>
    </footer>
  )
}

export default React.memo(Footer)
