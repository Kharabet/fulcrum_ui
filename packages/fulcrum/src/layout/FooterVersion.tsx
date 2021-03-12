import React from 'react'
import ImpersonateInput from '../components/ImpersonateInput'
import packageJson from '../../package.json'

function FooterVersion() {
  const [isImpersonateShown, setIsImpersonateShown] = React.useState(false)
  const onImpersonateShowClick = () => {
    setIsImpersonateShown(!isImpersonateShown)
  }
  return (
    <div className="footer-version">
      <div className="footer-menu__item">Version Alpha {packageJson.version}</div>
      <div className="footer-menu__item">
        Powered by <a href="//bzx.network">bZx</a>
      </div>
      <div className="footer-menu__item">
        <button className="impersonate-button" onClick={onImpersonateShowClick}>
          🕵️
        </button>
        {isImpersonateShown && <ImpersonateInput />}
      </div>
    </div>
  )
}

export default React.memo(FooterVersion)
