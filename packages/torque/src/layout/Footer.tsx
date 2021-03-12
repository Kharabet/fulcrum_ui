import React from 'react'
import { FooterMenu } from './FooterMenu'
import FooterVersion from './FooterVersion'

interface IFooterProps {
  isRiskDisclosureModalOpen: () => void
}

function Footer(props: IFooterProps) {
  return (
    <footer className="footer">
      <FooterVersion />
      <FooterMenu {...props} />
    </footer>
  )
}
export default React.memo(Footer)
