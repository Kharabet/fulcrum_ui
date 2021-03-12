/// <reference types="react-scripts" />
declare module 'react-intercom'

declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_ETH_NETWORK: 'mainnet' | 'kovan' | 'rinkeby' | 'ropsten' | 'bsc' | undefined
  }
}
