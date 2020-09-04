interface Ethereum {
  request: unknown;
  send: unknown;
  chainId: string;
  enable: () => Promise<string[]>
  on?: (method: string, listener: (...args: any[]) => void) => void
  removeListener?: (method: string, listener: (...args: any[]) => void) => void
}

declare interface Window {
  ethereum?: Ethereum
}

declare const __DEV__: boolean
