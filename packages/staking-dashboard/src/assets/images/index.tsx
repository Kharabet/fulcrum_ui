import React from 'react'
import { ReactComponent as TokenBpt } from 'app-images/token-bpt.svg'
import { ReactComponent as TokenBzrx } from 'app-images/token-bzrx.svg'
import { ReactComponent as TokenVBzrx } from 'app-images/token-vbzrx.svg'
import { ReactComponent as TokenIBzrx } from 'app-images/token-ibzrx.svg'
import { ReactComponent as TokenCrv } from 'app-images/token-crv.svg'

/**
 * Icons are indexed by name in lowercase
 * bzrx: <TokenBzrx className="token-logo" />, ...
 */
export const tokenIcons: { [index: string]: React.ReactNode } = {
  bzrx: <TokenBzrx className="token-logo" />,
  vbzrx: <TokenVBzrx className="token-logo" />,
  bpt: <TokenBpt className="token-logo" />,
  ibzrx: <TokenIBzrx className="token-logo" />,
  crv: <TokenCrv className="token-logo" />
}
