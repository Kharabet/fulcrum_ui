import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderMenuListItem } from "./ProviderMenuListItem";

import { AbstractConnector } from '@web3-react/abstract-connector'
import { useWeb3React } from '@web3-react/core'
import { useEagerConnect, useInactiveListener } from '../domain/WalletHooks'
import {
  injected,
  fortmatic,
  portis,
  squarelink,
} from '../domain/WalletConnectors'

export interface IProviderMenuProps {
  providerTypes: ProviderType[];
  selectedProviderType: ProviderType;

  onSelect: (providerType: ProviderType) => void;
}

const connectorsByName: { [name: string]: AbstractConnector } = {
  Injected: injected,
  Fortmatic: fortmatic,
  Portis: portis,
  Squarelink: squarelink,
}


export const ProviderMenu = (props: IProviderMenuProps) => {
  const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context

  // handle logic to recognize the connector currently being activated
  //@ts-ignore
  const [activatingConnector, setActivatingConnector] = React.useState()
  React.useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      //@ts-ignore
      setActivatingConnector(undefined)
    }
  }, [activatingConnector, connector])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector);
  const renderItems = () => {
    return props.providerTypes.map(e => {
      const currentConnector = connectorsByName[e]
      const activating = currentConnector === activatingConnector
      const connected = currentConnector === connector
      const disabled = !triedEager || !!activatingConnector || connected || !!error
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
          //@ts-ignore
          setActivatingConnector(currentConnector)
          activate(connectorsByName[e], (err) => console.log(err))
        }}
      />
    });
  }

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
