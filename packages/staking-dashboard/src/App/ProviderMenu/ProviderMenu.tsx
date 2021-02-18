import { ReactComponent as CloseIcon } from 'app-images/ic__close.svg'
import { observer } from 'mobx-react'
import React from 'react'
import Modal from 'react-modal'
import ProviderTypeDictionary from 'src/domain/ProviderTypeDictionary'
import AppVM from '../AppVM'
import ProviderMenuListItem from './ProviderMenuListItem'

const providerTypes = ProviderTypeDictionary.WalletProviders

export function ProviderMenu({ appVM }: { appVM: AppVM }) {
  const { web3Connection } = appVM.rootStore
  const { providerMenu } = appVM

  return (
    <Modal
      isOpen={providerMenu.visible}
      onRequestClose={providerMenu.hide}
      className="modal__content"
      overlayClassName="modal__overlay"
      ariaHideApp={false}>
      <div className="provider-menu">
        <div className="provider-menu__title">
          Select Wallet
          <div onClick={providerMenu.hide}>
            <CloseIcon className="disclosure__close" />
          </div>
        </div>
        <div className="provider-menu__list">
          {providerTypes.map((providerType) => {
            const connected = web3Connection.providerType === providerType
            const disabled = !!web3Connection.activatingProvider
            const activating = web3Connection.activatingProvider === providerType
            return (
              <ProviderMenuListItem
                key={providerType}
                providerType={providerType}
                isConnected={connected}
                isActivating={activating}
                disabled={disabled}
                connect={appVM.connect}
                web3Connection={web3Connection}
              />
            )
          })}
        </div>
        <button type="button" className="disconnect" onClick={appVM.disconnect}>
          Disconnect
        </button>
      </div>
    </Modal>
  )
}

export default observer(ProviderMenu)
