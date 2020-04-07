import React, { Component } from "react";
import { ProviderType } from "../domain/ProviderType";
import { ProviderTypeDictionary } from "../domain/ProviderTypeDictionary";
import { useWeb3React } from '@web3-react/core';
import {FulcrumProvider} from '../services/FulcrumProvider';

export interface IProviderMenuListItemProps {
  providerType: ProviderType;
  isConnected: boolean;
  isActivating: boolean;
  onSelect: (providerType: ProviderType) => void;
}

const Loader = () => {
    return (
      <div className="loader">
        <div className="loader-content">
          <div className="loader-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    );
}

export function ProviderMenuListItem(props: IProviderMenuListItemProps) {
  const context = useWeb3React()
  const { connector, library, chainId, account, activate, deactivate, active, error } = context
  const providerTypeDetails = ProviderTypeDictionary.providerTypes.get(props.providerType) || null;
  if (!providerTypeDetails) {
    return null;
  }

  const onClick = () => {
    if(props.isConnected) return;
    props.onSelect(props.providerType);
  };

  const isProviderTypeActiveClass =
    props.isConnected ? "provider-menu__list-item--selected" : "";

  let walletAddressText: string;
  if (FulcrumProvider.Instance.unsupportedNetwork) {
    walletAddressText = "Wrong Network!";
  } else if (account) {
    walletAddressText = `${account.slice(0, 6)}...${account.slice(
      account.length - 4,
      account.length
    )}`;
  } else {
    walletAddressText = ""; // "...";
  }
  const isSupportedNetwork = !FulcrumProvider.Instance.unsupportedNetwork;
    const etherscanURL = FulcrumProvider.Instance.web3ProviderSettings
      ? FulcrumProvider.Instance.web3ProviderSettings.etherscanURL
      : "";

  return (
    <li className={`provider-menu__list-item ${isProviderTypeActiveClass}`} onClick={onClick}>
      {props.isConnected ?
        <div className="provider-menu__list-item-description">
          <span className="provider-name">{providerTypeDetails.displayName}</span>
          {walletAddressText ? (
            isSupportedNetwork && account && etherscanURL ? (
              <a
                className="address"
                href={`${etherscanURL}address/${account}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={event => event.stopPropagation()}
              >
                {walletAddressText}
              </a>
            ) : (
                <span className="address">
                  {walletAddressText}
                </span>
              )
          ) : (
              ``
            )}
        </div> :
        <div className="provider-menu__list-item-content-txt">{providerTypeDetails.displayName}</div>

      }{props.isActivating
        ? <div className="provider-menu__list-item-content-img"><Loader /></div>
        : <div className="provider-menu__list-item-content-img">{providerTypeDetails.reactLogoSvgShort.render()}</div>
      }
    </li>
  );
}

 
