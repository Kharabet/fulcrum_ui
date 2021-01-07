/// <reference types="react-scripts" />
declare module 'react-number-easing'
declare module 'node-fetch'
declare module 'react-intercom'
declare module '3box' {
  export const getProfile = (
    address: string,
    opts: { profileServer: string; metadata: string; blocklist: () => void } = {}
  ): Promise<{ name: string; image: Array<{ contentUrl: { '/': any } }> }> => {}
}

declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_ETH_NETWORK: 'mainnet' | 'kovan' | 'rinkeby' | 'ropsten' | undefined
  }
}
