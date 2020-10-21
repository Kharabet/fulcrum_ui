import React, { useEffect } from "react";
import { BigNumber } from "@0x/utils";
import { Asset } from "../domain/Asset";
import { AssetsDictionary } from "../domain/AssetsDictionary";
import { ProviderType } from "../domain/ProviderType";
import { ProviderMenuListItem } from "./ProviderMenuListItem";
import { useWeb3React } from '@web3-react/core';
import ProviderTypeDictionary from "../domain/ProviderTypeDictionary";
import { ExplorerProvider } from "../services/ExplorerProvider";
import { injected } from "../domain/WalletConnectors";
import { AbstractConnector } from '@web3-react/abstract-connector';
import { SwitchButtonInput } from "./SwitchButtonInput";
import { ReactComponent as CloseIcon } from "../assets/images/ic__close.svg"

export interface IProviderMenuProps {
    providerTypes: ProviderType[];
    isMobileMedia: boolean;
    onSelect: (selectedConnector: AbstractConnector, account?: string) => void;
    onDeactivate: () => void;
    onProviderMenuClose: () => void;
}

export const ProviderMenu = (props: IProviderMenuProps) => {

    useEffect(() => {
        const isGasTokenEnabled = localStorage.getItem('isGasTokenEnabled') === "true";
        const switchButton = document.querySelector<HTMLInputElement>('.provider-menu__gas-token-switch input[type="checkbox"]');
        if (switchButton) {
            if (isGasTokenEnabled) {
                switchButton.setAttribute('data-isgastokenenabled', 'true');
                localStorage.setItem('isGasTokenEnabled', 'true');
                switchButton.checked = true;
            }
            else {
                switchButton.setAttribute('data-isgastokenenabled', 'false');
                localStorage.setItem('isGasTokenEnabled', 'false');
                switchButton.checked = false;
            };
        }

    });
    const context = useWeb3React()
    const { connector, account, activate, deactivate, active, error } = context

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
    if (!activatingConnector && connector !== injected && props.isMobileMedia && ExplorerProvider.Instance.providerType !== ProviderType.MetaMask) {

        //@ts-ignore
        setActivatingConnector(injected);
        activate(injected);
    }

    const storedProvider: any = ExplorerProvider.getLocalstorageItem('providerType');
    const providerType: ProviderType | null = storedProvider as ProviderType || null;
    if (!activatingConnector && providerType && providerType !== ExplorerProvider.Instance.providerType) {

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
            return <ProviderMenuListItem
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

    const onChiSwitch = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const switchButton = e.currentTarget;
        if (!ExplorerProvider.Instance.contractsSource) return;
        if (switchButton.checked) {
            await ExplorerProvider.Instance.checkAndSetApprovalForced(
                Asset.CHI,
                "0x55eb3dd3f738cfdda986b8eff3fa784477552c61",
                new BigNumber(10 ** 18)
            );
            switchButton.setAttribute('data-isgastokenenabled', 'true');
            localStorage.setItem('isGasTokenEnabled', 'true');
        } else {
            await ExplorerProvider.Instance.checkAndSetApprovalForced(
                Asset.CHI,
                "0x55eb3dd3f738cfdda986b8eff3fa784477552c61",
                new BigNumber(0)
            );
            switchButton.setAttribute('data-isgastokenenabled', 'false');
            localStorage.setItem('isGasTokenEnabled', 'false');
        }
    }
    const ChiTokenLogo = AssetsDictionary.assets.get(Asset.CHI)!.logoSvg;
    return (
        <div className="provider-menu">

            <div className="provider-menu__title">
                Select Wallet
                <div onClick={props.onProviderMenuClose}>
                    <CloseIcon className="disclosure__close" />
                </div>
            </div>
            {account &&
                <div className="provider-menu__gas-token">
                    <div className="provider-menu__gas-token-logo"><ChiTokenLogo /></div>
                    <p className="provider-menu__gas-token-text">Use CHI token to save on gas. It would be burned from your wallet on each transaction to save on TX cost.</p>
                    <div className="provider-menu__gas-token-switch"><SwitchButtonInput onSwitch={onChiSwitch} /></div>
                </div>
            }
            <ul className="provider-menu__list">{renderItems()}</ul>
            < button
                className="disconnect"
                key={ProviderType.None}
                onClick={() => {
                    deactivate()
                    props.onDeactivate()
                }}
            >Disconnect
      </button>
            <div className="provider-menu__footer">
                By connecting, you agree to the&nbsp;
          <a href="https://fulcrum.trade/tos/">Terms of Service</a>&nbsp;and&nbsp;
          <a href="https://fulcrum.trade/privacy/">Privacy Policy</a>
            </div>
        </div>
    );
}