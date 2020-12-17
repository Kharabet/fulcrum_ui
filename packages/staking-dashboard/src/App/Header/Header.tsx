import { observer } from 'mobx-react'
import React from 'react'
import HeaderDesktop from './HeaderDesktop'
import HeaderMobile from './HeaderMobile'
import AppVM from '../AppVM'

export function Header({ appVM }: { appVM: AppVM }) {
  return appVM.rootStore.uiStore.media.smScreen ? (
    <HeaderMobile appVM={appVM} />
  ) : (
    <HeaderDesktop appVM={appVM} />
  )
}

export default observer(Header)
