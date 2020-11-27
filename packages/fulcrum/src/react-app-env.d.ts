/// <reference types="react-scripts" />
declare module 'react-tippy'
declare module 'react-intercom'

declare namespace NodeJS {
  export interface ProcessEnv {
    REACT_APP_ETH_NETWORK: 'mainnet' | 'kovan' | 'rinkeby' | 'ropsten' | undefined
    REACT_APP_GIT_SHA: string
  }
}
