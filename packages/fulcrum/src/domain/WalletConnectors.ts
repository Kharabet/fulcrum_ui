import { InjectedConnector } from '@web3-react/injected-connector';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { WalletLinkConnector } from '@web3-react/walletlink-connector';
import { LedgerConnector } from '@web3-react/ledger-connector';
import { TrezorConnector } from '@web3-react/trezor-connector';
// import { FrameConnector } from '@web3-react/frame-connector'
import { AuthereumConnector } from '@web3-react/authereum-connector';
import { FortmaticConnector } from '@web3-react/fortmatic-connector';
import { PortisConnector } from '@web3-react/portis-connector';
import { SquarelinkConnector } from '@web3-react/squarelink-connector';
import { BitskiConnector } from '@web3-react/bitski-connector';
import { TorusConnector } from '@web3-react/torus-connector';
import fulcrumLogo from "../assets/images/fulcrum_logo.svg";


import configProviders from "../config/providers.json";
const getNetworkIdByString = (networkName: string | undefined) => {
  switch (networkName) {
    case 'mainnet':
      return 1;
    case 'ropsten':
      return 3;
    case 'rinkeby':
      return 4;
    case 'kovan':
      return 42;
    default:
      return 0;
  }
}
const networkName = process.env.REACT_APP_ETH_NETWORK;
const networkId = getNetworkIdByString(networkName);

const RPC_URL = networkId === 42
  ? `https://eth-${networkName}.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey_kovan}`
  : `https://eth-${networkName}.alchemyapi.io/jsonrpc/${configProviders.Alchemy_ApiKey}`

const POLLING_INTERVAL = 3600000


export const injected = new InjectedConnector({ supportedChainIds: [1, 3, 4, 42] })

// export const network = new NetworkConnector({
//   urls: { 1: RPC_URLS[1], 4: RPC_URLS[4] },
//   defaultChainId: 1,
//   pollingInterval: POLLING_INTERVAL
// })

export const walletconnect = new WalletConnectConnector({
  rpc: { [networkId]: RPC_URL },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL
})

export const walletlink = new WalletLinkConnector({
  url: RPC_URL,
  appName: 'bZx | Fulcrum'
  // appLogoUrl: `https://app.fulcrum.trade${fulcrumLogo}`
})

export const ledger = new LedgerConnector({
  chainId: networkId,
  url: RPC_URL,
  pollingInterval: POLLING_INTERVAL
})

export const trezor = new TrezorConnector({
  chainId: networkId,
  url: RPC_URL,
  pollingInterval: POLLING_INTERVAL,
  manifestEmail: 'hello@bzx.network',
  manifestAppUrl: window.location.origin
})

// export const frame = new FrameConnector({ supportedChainIds: [1] })

export const authereum = new AuthereumConnector({ chainId: networkId })

export const fortmatic = new FortmaticConnector({
  apiKey: configProviders.Fortmatic_ApiKey as string,
  chainId: networkId
})

export const portis = new PortisConnector({
  dAppId: configProviders.Portis_DAppId as string,
  networks: [networkId]
})

export const squarelink = new SquarelinkConnector({
  clientId: configProviders.Squarelink_ClientId as string,
  networks: [networkId]
})

export const bitski = new BitskiConnector({
  clientId: configProviders.Bitski_ClientId as string,
  network: networkId,
  redirectUri: `${window.location.origin}/callback.html`
})

export const torus = new TorusConnector({
  chainId: networkId, 
  constructorOptions: {
    buttonPosition: 'top-left' // default: bottom-left
  },
  initOptions: {
    buildEnv: 'production',
    enableLogging: false,
    network: {
      host: networkName || "mainnet",
      chainId: networkId
    },
    showTorusButton: true
  } 
})
