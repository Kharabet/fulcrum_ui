import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderMenuListItem } from "./ProviderMenuListItem";
import { useWeb3React } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../domain/WalletHooks'
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { FulcrumProvider } from "../services/FulcrumProvider";
import { injected } from "../domain/WalletConnectors";

export interface IProviderMenuProps {
  providerTypes: ProviderType[];
  selectedProviderType: ProviderType;
  isMobileMedia: boolean;
  onSelect: (providerType: ProviderType) => void;
}

export const ProviderMenu = (props: IProviderMenuProps) => {
  const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context
  alert("rendering providerMenu");

  // handle logic to recognize the connector currently being activated
  //@ts-ignore
  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()
  // if (!activatingConnector && connector !== injected && props.isMobileMedia && FulcrumProvider.Instance.providerType !== ProviderType.MetaMask) {
  //   alert("activateMobile");

  //   //@ts-ignore
  //   setActivatingConnector(injected);
  //   activate(injected);
  //   // return <React.Fragment/>;
  // }
  // const storedProvider: any = FulcrumProvider.getLocalstorageItem('providerType');
  // const providerType: ProviderType | null = storedProvider as ProviderType || null;
  // if (!activatingConnector && providerType && providerType !== FulcrumProvider.Instance.providerType) {
  //   alert("localstorage");

  //   //@ts-ignore
  //   setActivatingConnector(ProviderTypeDictionary.getConnectorByProviderType(providerType)!);
  //   activate(ProviderTypeDictionary.getConnectorByProviderType(providerType)!);
  //   // return <React.Fragment/>;
  // }
  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);
  alert(`eager ${triedEager}`)
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
  alert("render as usual")

  return (
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
