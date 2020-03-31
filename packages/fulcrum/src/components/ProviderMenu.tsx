import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderMenuListItem } from "./ProviderMenuListItem";
import { useWeb3React } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../domain/WalletHooks'
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { FulcrumProvider } from "../services/FulcrumProvider";

export interface IProviderMenuProps {
  providerTypes: ProviderType[];
  selectedProviderType: ProviderType;
  isMobileMedia: boolean;
  onSelect: (providerType: ProviderType) => void;
}

export const ProviderMenu = (props: IProviderMenuProps) => {
  const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context


  // handle logic to recognize the connector currently being activated
  //@ts-ignore
  const [activatingConnector, setActivatingConnector] = React.useState(undefined)
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      //@ts-ignore
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  // const triedEager = useEagerConnect()
  if (!activatingConnector && props.isMobileMedia) {
    //@ts-ignore
    setActivatingConnector(ProviderTypeDictionary.getConnectorByProviderType(ProviderType.MetaMask)!);
    activate(ProviderTypeDictionary.getConnectorByProviderType(ProviderType.MetaMask)!);
    return null;
  }
  const storedProvider: any = FulcrumProvider.getLocalstorageItem('providerType');
  const providerType: ProviderType | null = storedProvider as ProviderType || null;
  if (!activatingConnector && providerType && providerType !== FulcrumProvider.Instance.providerType) {
    //@ts-ignore
    setActivatingConnector(ProviderTypeDictionary.getConnectorByProviderType(providerType)!);
    activate(ProviderTypeDictionary.getConnectorByProviderType(providerType)!);
    return null;
  }
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  // useInactiveListener(!triedEager || !!activatingConnector);
  const renderItems = () => {
    return props.providerTypes.map(e => {
      const currentConnector = ProviderTypeDictionary.getConnectorByProviderType(e);
      const activating = currentConnector === activatingConnector
      const connected = currentConnector === connector
      const disabled = !!activatingConnector || connected || !!error
      return < ProviderMenuListItem
        key={e}
        providerType={e}
        selectedProviderType={props.selectedProviderType}
        onSelect={() => {
          if (e === ProviderType.None) {
            deactivate()
            props.onSelect(ProviderType.None);
            return;
          }
          if (!currentConnector) return;
          //@ts-ignore
          setActivatingConnector(currentConnector)
          activate(currentConnector, (err) => console.log(err))
        }}
      />
    });
  }

  return activatingConnector ? null : (
    <div className="provider-menu">
      <div className="provider-menu__title">Select Wallet Provider</div>
      <ul className="provider-menu__list">{renderItems()}</ul>
      <div className="provider-menu__footer">
        By connecting, you agree to the&nbsp;
          <a href="https://fulcrum.trade/tos/">Terms of Service</a>&nbsp;and&nbsp;
          <a href="https://fulcrum.trade/privacy/">Privacy Policy</a>
      </div>
    </div>
  );
}
