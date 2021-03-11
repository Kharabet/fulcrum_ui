import React, { Component, useEffect, useState } from 'react'
import { ProviderType } from '../domain/ProviderType'
import { ProviderMenuListItem } from './ProviderMenuListItem'
import { useWeb3React } from '@web3-react/core'
import { ProviderTypeDictionary } from '../domain/ProviderTypeDictionary'
import { TorqueProvider } from '../services/TorqueProvider'
import { injected } from 'bzx-common/src/lib/web3ReactUtils'
import { AbstractConnector } from '@web3-react/abstract-connector'
import { SwitchButtonInput } from './SwitchButtonInput'
import { ReactComponent as CloseIcon } from '../assets/images/ic__close.svg'
import Asset from 'bzx-common/src/assets/Asset'
import { BigNumber } from '@0x/utils'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'

export interface IProviderMenuProps {
  providerTypes: ProviderType[]
  isMobileMedia: boolean
  onSelect: (selectedConnector: AbstractConnector, account?: string) => void
  onDeactivate: () => void
  onProviderMenuClose: () => void
  onChiSwitch: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const ProviderMenu = (props: IProviderMenuProps) => {
  const [isEnabledChi, setChi] = useState(false)
  useEffect(() => {
    const isGasTokenEnabled = localStorage.getItem('isGasTokenEnabled') === 'true'
    const switchButton = document.querySelector<HTMLInputElement>(
      '.provider-menu .theme-switch input[type="checkbox"]'
    )
    if (switchButton) {
      if (isGasTokenEnabled) {
        setChi(true)
        switchButton.setAttribute('data-isgastokenenabled', 'true')
        localStorage.setItem('isGasTokenEnabled', 'true')
        switchButton.checked = true
      } else {
        setChi(false)
        switchButton.setAttribute('data-isgastokenenabled', 'false')
        localStorage.setItem('isGasTokenEnabled', 'false')
        switchButton.checked = false
      }
    }
  })

  const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  //@ts-ignore
  const [activatingConnector, setActivatingConnector] = React.useState()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      if (active && connector && account) {
        props.onSelect(connector, account)
      }
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  if (
    !activatingConnector &&
    connector !== injected &&
    props.isMobileMedia &&
    TorqueProvider.Instance.providerType !== ProviderType.MetaMask
  ) {
    //@ts-ignore
    setActivatingConnector(injected)
    activate(injected)
  }

  const storedProvider: any = TorqueProvider.getLocalstorageItem('providerType')
  const providerType: ProviderType | null = (storedProvider as ProviderType) || null
  if (
    !activatingConnector &&
    providerType &&
    providerType !== TorqueProvider.Instance.providerType
  ) {
    //@ts-ignore
    setActivatingConnector(ProviderTypeDictionary.getConnectorByProviderType(providerType)!)
    activate(ProviderTypeDictionary.getConnectorByProviderType(providerType)!)
  }

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  // useInactiveListener(!triedEager || !!activatingConnector);
  const renderItems = () => {
    return props.providerTypes.map((e) => {
      const currentConnector = ProviderTypeDictionary.getConnectorByProviderType(e)
      const activating = currentConnector === activatingConnector
      const connected = currentConnector === connector && active
      const disabled = !!activatingConnector || connected || !!error
      return (
        <ProviderMenuListItem
          key={e}
          providerType={e}
          isConnected={connected}
          isActivating={activating}
          onSelect={() => {
            if (!currentConnector) return
            //@ts-ignore
            setActivatingConnector(currentConnector)
            activate(currentConnector, (err: any) => console.error(err))
          }}
        />
      )
    })
  }

  const onChiSwitch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const switchButton = e.currentTarget
    if (!TorqueProvider.Instance.contractsSource) return
    if (switchButton.checked) {
      await TorqueProvider.Instance.setApproval(
        '0x55eb3dd3f738cfdda986b8eff3fa784477552c61',
        Asset.CHI,
        new BigNumber(10 ** 18)
      )
      switchButton.setAttribute('data-isgastokenenabled', 'true')
      localStorage.setItem('isGasTokenEnabled', 'true')
      setChi(true)
    } else {
      await TorqueProvider.Instance.setApproval(
        '0x55eb3dd3f738cfdda986b8eff3fa784477552c61',
        Asset.CHI,
        new BigNumber(0)
      )
      switchButton.setAttribute('data-isgastokenenabled', 'false')
      localStorage.setItem('isGasTokenEnabled', 'false')
      setChi(false)
    }
  }

  const ChiTokenLogo = AssetsDictionary.assets.get(Asset.CHI)!.reactLogoSvg

  return (
    <div className="provider-menu">
      <div className="provider-menu__title">
        Select Wallet
        <CloseIcon className="disclosure__close" onClick={props.onProviderMenuClose} />
      </div>
      {account && (
        <div className="provider-menu__gas-token">
          <div className="provider-menu__gas-token-left">
            <div className="provider-menu__gas-token-logo">
              <ChiTokenLogo />
            </div>
            <div className="provider-menu__gas-token-label">
              CHI {isEnabledChi ? `Enabled` : `Disabled`}
            </div>
            <div className="provider-menu__gas-token-switch">
              <SwitchButtonInput onSwitch={onChiSwitch} />
            </div>
          </div>
          <div className="provider-menu__gas-token-right">
            <p className="provider-menu__gas-token-title">
              For a better Fulcrum & Torque experience we suggest enabling CHI token.
            </p>
            <p className="provider-menu__gas-token-description">
              Use CHI token to save on high gas fees. Chi will be burned from your wallet, saving
              you up to 50% on all transaction fees.
            </p>
            <div className="provider-menu__gas-token-links">
              <a
                href="https://app.uniswap.org/#/swap?inputCurrency=0x0000000000004946c0e9f43f4dee607b0ef1fa1c"
                target="_blank"
                rel="noopener noreferrer">
                Buy chi
              </a>
              <a
                href="https://1inch-exchange.medium.com/everything-you-wanted-to-know-about-chi-gastoken-a1ba0ea55bf3"
                target="_blank"
                rel="noopener noreferrer">
                Learn more
              </a>
            </div>
          </div>
        </div>
      )}
      <ul className="provider-menu__list">{renderItems()}</ul>
      <button
        className="disconnect"
        key={ProviderType.None}
        onClick={() => {
          deactivate()
          props.onDeactivate()
        }}>
        Disconnect
      </button>
      <div className="provider-menu__footer">
        By connecting, you agree to the&nbsp;
        <a href="https://fulcrum.trade/tos/">Terms of Service</a>&nbsp;and&nbsp;
        <a href="https://fulcrum.trade/privacy/">Privacy Policy</a>
      </div>
    </div>
  )
}
