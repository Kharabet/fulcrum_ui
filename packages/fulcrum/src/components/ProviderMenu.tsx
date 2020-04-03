import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderMenuListItem } from "./ProviderMenuListItem";
import { useWeb3React } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../domain/WalletHooks'
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { injected } from "../domain/WalletConnectors";
import { AbstractConnector } from '@web3-react/abstract-connector';

export interface IProviderMenuProps {
  providerTypes: ProviderType[];
  selectedProviderType: ProviderType;
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
        connector; 
        props.onSelect(connector, account);
      }
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  if (!activatingConnector && connector !== injected && props.isMobileMedia && FulcrumProvider.Instance.providerType !== ProviderType.MetaMask) {

    //@ts-ignore
    setActivatingConnector(injected);
    activate(injected);
    // return <React.Fragment/>;
  }
  const storedProvider: any = FulcrumProvider.getLocalstorageItem('providerType');
  const providerType: ProviderType | null = storedProvider as ProviderType || null;
  if (!activatingConnector && providerType && providerType !== FulcrumProvider.Instance.providerType) {

    //@ts-ignore
    setActivatingConnector(ProviderTypeDictionary.getConnectorByProviderType(providerType)!);
    //@ts-ignore
    activate(ProviderTypeDictionary.getConnectorByProviderType(providerType)!);
    // return <React.Fragment/>;
  }
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  // useInactiveListener(!triedEager || !!activatingConnector);
  const renderItems = () => {
    return props.providerTypes.map(e => {
      const currentConnector = ProviderTypeDictionary.getConnectorByProviderType(e);
      const activating = currentConnector === activatingConnector
      //@ts-ignore
      const connected = currentConnector === connector
      const disabled = !!activatingConnector || connected || !!error
      return < ProviderMenuListItem
        key={e}
        providerType={e}
        isConnected={connected}
        isActivating={activating}
        selectedProviderType={props.selectedProviderType}
        onSelect={() => {
          if (!currentConnector) return;
          //@ts-ignore
          setActivatingConnector(currentConnector)
          //@ts-ignore
          activate(currentConnector, (err) => console.log(err))
        }}
      />
    });
  }

  return (
    <div className="provider-menu">
      <div className="provider-menu__title">Select Wallet Provider</div>
      <ul className="provider-menu__list">{renderItems()}</ul>
      < button
        className="disconnect"
        key={ProviderType.None}
        onClick={() => {
          deactivate()
          props.onDeactivate()
        }}
      >DISCONNECT
      </button>
      <div className="provider-menu__footer">
        By connecting, you agree to the&nbsp;
          <a href="https://fulcrum.trade/tos/">Terms of Service</a>&nbsp;and&nbsp;
          <a href="https://fulcrum.trade/privacy/">Privacy Policy</a>
      </div>
    </div>
  );
}
