/// <reference types="react-scripts" />
declare module 'react-number-easing'
declare module 'node-fetch'
declare module 'react-intercom'

declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_ETH_NETWORK: 'mainnet' | 'kovan' | 'rinkeby' | 'ropsten' | undefined
  }
}
