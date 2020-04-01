import { ConnectorUpdate } from '@web3-react/types'
import { AbstractConnector } from '@web3-react/abstract-connector'
import invariant from 'tiny-invariant'
// @ts-ignore
import { AuthenticationStatus, Bitski, BitskiSDKOptions, BitskiEngine ,User } from "bitski";

const chainIdToNetwork: { [network: number]: string } = {
  1: 'mainnet',
  3: 'ropsten',
  4: 'rinkeby',
  42: 'kovan'
}

type Network = number | { chainId: number;[key: string]: any }

interface BitskiConnectorArguments {
  clientId: string;
  network: number;
  redirectUri?: string;
  additionalScopes?: string[];
  options?: BitskiSDKOptions;
}

export class BitskiConnector extends AbstractConnector {
  private readonly clientId: string;
  private readonly networkName: any;
  private readonly chainId: number;

  public bitski: any

  constructor({ clientId, network, redirectUri, additionalScopes, options }: BitskiConnectorArguments) {

    super()
    this.bitski = new Bitski(
      clientId,
      redirectUri,
      additionalScopes,
      options
    )
    this.chainId = network;
    this.networkName = chainIdToNetwork[network];
    this.clientId = clientId;
  }

  public async activate(): Promise<ConnectorUpdate> {


    const provider = await this.getProvider()

    const account = await this.bitski.signIn().then((user: User): string => user.accounts[0])

    return { provider, account }
  }

  public async getProvider(): Promise<BitskiEngine> {

    return await this.bitski.getProvider(this.networkName);
  }

  public async getChainId(): Promise<number | string> {
    return this.chainId;
  }

  public async getAccount(): Promise<null | string> {

    return (await this.bitski.getUser()).accounts[0] || null;
  }

  public async deactivate() {
    await this.bitski.signOut();
  }
}