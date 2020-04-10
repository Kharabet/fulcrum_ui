import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderMenuListItem } from "./ProviderMenuListItem";
import { useWeb3React } from '@web3-react/core';
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { TorqueProvider } from "../services/TorqueProvider";
import { injected } from "../domain/WalletConnectors";
import { AbstractConnector } from '@web3-react/abstract-connector';

export interface IProviderMenuProps {
  providerTypes: ProviderType[];
  isMobileMedia: boolean;
  onSelect: (selectedConnector: AbstractConnector, account?: string) => void;
  onDeactivate: () => void;
}

export const ProviderMenu = (props: IProviderMenuProps) => {
  const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  //@ts-ignore
  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      if (active && connector && account) {
        props.onSelect(connector, account);
      }
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  if (!activatingConnector && connector !== injected && props.isMobileMedia && TorqueProvider.Instance.providerType !== ProviderType.MetaMask) {

    //@ts-ignore
    setActivatingConnector(injected);
    activate(injected);
  }

  const storedProvider: any = TorqueProvider.getLocalstorageItem('providerType');
  const providerType: ProviderType | null = storedProvider as ProviderType || null;
  if (!activatingConnector && providerType && providerType !== TorqueProvider.Instance.providerType) {

    //@ts-ignore
    setActivatingConnector(ProviderTypeDictionary.getConnectorByProviderType(providerType)!);
    activate(ProviderTypeDictionary.getConnectorByProviderType(providerType)!);
    
  }
  
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  // useInactiveListener(!triedEager || !!activatingConnector);
  const renderItems = () => {
    return props.providerTypes.map(e => {
      const currentConnector = ProviderTypeDictionary.getConnectorByProviderType(e);
      const activating = currentConnector === activatingConnector
      const connected = currentConnector === connector && active
      const disabled = !!activatingConnector || connected || !!error
      return < ProviderMenuListItem
        key={e}
        providerType={e}
        isConnected={connected}
        isActivating={activating}
        onSelect={() => {
          if (!currentConnector) return;
          //@ts-ignore
          setActivatingConnector(currentConnector)
          activate(currentConnector, (err) => console.error(err))
        }}
      />
    });
  }

  return (
    <div className="provider-menu">
      <div className="provider-menu__title">Select Wallet</div>
      <ul className="provider-menu__list">{renderItems()}</ul>
      < button
        className="disconnect"
        key={ProviderType.None}
        onClick={() => {
          deactivate()
          props.onDeactivate()
        }}
      >Deactivate
      </button>
    </div>
  );
}