import React, { Component, useEffect } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderMenuListItem } from "./ProviderMenuListItem";
import { useWeb3React } from '@web3-react/core';
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { injected } from "../domain/WalletConnectors";
import { AbstractConnector } from '@web3-react/abstract-connector';
import { SwitchButtonInput } from "./SwitchButtonInput";

export interface IProviderMenuProps {
  providerTypes: ProviderType[];
  isMobileMedia: boolean;
  onSelect: (selectedConnector: AbstractConnector, account?: string) => void;
  onDeactivate: () => void;
}

export const ProviderMenu = (props: IProviderMenuProps) => {

  
  useEffect(() => {
    var isGasTokenEnbaled = localStorage.getItem('isGasTokenEnabled') === "true";
    var switchButton = document.querySelector<HTMLInputElement>('.provider-menu .theme-switch input[type="checkbox"]');

    if (isGasTokenEnbaled) {

      switchButton!.setAttribute('data-isgastokenenabled', 'true');
      localStorage.setItem('isGasTokenEnabled', 'true');
      switchButton!.checked = true;
    }
    else {
      switchButton!.setAttribute('data-isgastokenenabled', 'false');
      localStorage.setItem('isGasTokenEnabled', 'false');
      switchButton!.checked = false;
    };

  });
  const context = useWeb3React();
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  //@ts-ignore
  const [activatingConnector, setActivatingConnector] = React.useState()
  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      if (active && connector && account) {
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
  }

  const storedProvider: any = FulcrumProvider.getLocalstorageItem('providerType');
  const providerType: ProviderType | null = storedProvider as ProviderType || null;
  const newConnector = ProviderTypeDictionary.getConnectorByProviderType(providerType)
  if (!activatingConnector && providerType && newConnector && connector !== newConnector) {

    if (!newConnector) return null;
    //@ts-ignore
    setActivatingConnector(newConnector);
    activate(newConnector);

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
          activate(currentConnector, (err) => {
            console.error(err)
            props.onDeactivate();
          })
        }}
      />
    });
  }

  const onChiSwitch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const switchButton = e.currentTarget;
    if (switchButton.checked) {
      switchButton.setAttribute('data-isgastokenenabled', 'true');
      localStorage.setItem('isGasTokenEnabled', 'true');
    } else {
      switchButton.setAttribute('data-isgastokenenabled', 'false');
      localStorage.setItem('isGasTokenEnabled', 'false');
    }
  }


  return (
    <div className="provider-menu">
      <div className="provider-menu__title">Select Wallet Provider</div>
      <SwitchButtonInput onSwitch={onChiSwitch} />
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