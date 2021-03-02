// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma enum-naming
// tslint:disable:whitespace no-unbound-method no-trailing-whitespace
// tslint:disable:no-unused-variable
import {
  AwaitTransactionSuccessOpts,
  ContractFunctionObj,
  ContractTxFunctionObj,
  SendTransactionOpts,
  BaseContract,
  SubscriptionManager,PromiseWithTransactionHash,
  methodAbiToFunctionSignature,
  linkLibrariesInBytecode,
} from '@0x/base-contract';
import { schemas } from '@0x/json-schemas';
import {
  BlockParam,
  BlockParamLiteral,
  BlockRange,
  CallData,
  ContractAbi,
  ContractArtifact,
  DecodedLogArgs,
  LogWithDecodedArgs,
  MethodAbi,
  TransactionReceiptWithDecodedLogs,
  TxData,
  TxDataPayable,
  SupportedProvider,
} from 'ethereum-types';
import { BigNumber, classUtils, hexUtils, logUtils, providerUtils } from '@0x/utils';
import { EventCallback, IndexedFilterValues, SimpleContractArtifact } from '@0x/types';
import { Web3Wrapper } from '@0x/web3-wrapper';
import { assert } from '@0x/assert';
import * as ethers from 'ethers';
// tslint:enable:no-unused-variable


export type BZRXStakingInterimEventArgs =
  | BZRXStakingInterimDelegateChangedEventArgs
  | BZRXStakingInterimOwnershipTransferredEventArgs
  | BZRXStakingInterimRewardAddedEventArgs
  | BZRXStakingInterimStakedEventArgs;

export enum BZRXStakingInterimEvents {
  DelegateChanged = 'DelegateChanged',
  OwnershipTransferred = 'OwnershipTransferred',
  RewardAdded = 'RewardAdded',
  Staked = 'Staked',
}

export interface BZRXStakingInterimDelegateChangedEventArgs extends DecodedLogArgs {
  user: string;
  oldDelegate: string;
  newDelegate: string;
}

export interface BZRXStakingInterimOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string;
  newOwner: string;
}

export interface BZRXStakingInterimRewardAddedEventArgs extends DecodedLogArgs {
  reward: BigNumber;
  duration: BigNumber;
}

export interface BZRXStakingInterimStakedEventArgs extends DecodedLogArgs {
  user: string;
  token: string;
  delegate: string;
  amount: BigNumber;
}


/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class BZRXStakingInterimContract extends BaseContract {
  /**
    * @ignore
    */
public static deployedBytecode: string | undefined;
public static contractName = 'BZRXStakingInterim';
  private readonly _methodABIIndex: { [name: string]: number } = {};
private readonly _subscriptionManager: SubscriptionManager<BZRXStakingInterimEventArgs, BZRXStakingInterimEvents>;
public static async deployFrom0xArtifactAsync(
    artifact: ContractArtifact | SimpleContractArtifact,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
  ): Promise<BZRXStakingInterimContract> {
    assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema, [
      schemas.addressSchema,
      schemas.numberSchema,
      schemas.jsNumber,
    ]);
    if (artifact.compilerOutput === undefined) {
      throw new Error('Compiler output not found in the artifact file');
    }
    const provider = providerUtils.standardizeOrThrow(supportedProvider);
    const bytecode = artifact.compilerOutput.evm.bytecode.object;
    const abi = artifact.compilerOutput.abi;
    const logDecodeDependenciesAbiOnly: { [contractName: string]: ContractAbi } = {};
    if (Object.keys(logDecodeDependencies) !== undefined) {
      for (const key of Object.keys(logDecodeDependencies)) {
        logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
      }
    }
    return BZRXStakingInterimContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
  }

  public static async deployWithLibrariesFrom0xArtifactAsync(
    artifact: ContractArtifact,
    libraryArtifacts: { [libraryName: string]: ContractArtifact },
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
  ): Promise<BZRXStakingInterimContract> {
    assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema, [
      schemas.addressSchema,
      schemas.numberSchema,
      schemas.jsNumber,
    ]);
    if (artifact.compilerOutput === undefined) {
      throw new Error('Compiler output not found in the artifact file');
    }
    const provider = providerUtils.standardizeOrThrow(supportedProvider);
    const abi = artifact.compilerOutput.abi;
    const logDecodeDependenciesAbiOnly: { [contractName: string]: ContractAbi } = {};
    if (Object.keys(logDecodeDependencies) !== undefined) {
      for (const key of Object.keys(logDecodeDependencies)) {
        logDecodeDependenciesAbiOnly[key] = logDecodeDependencies[key].compilerOutput.abi;
      }
    }
    const libraryAddresses = await BZRXStakingInterimContract._deployLibrariesAsync(
      artifact,
      libraryArtifacts,
      new Web3Wrapper(provider),
      txDefaults
    );
    const bytecode = linkLibrariesInBytecode(
      artifact,
      libraryAddresses,
    );
    return BZRXStakingInterimContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
  }

  public static async deployAsync(
    bytecode: string,
    abi: ContractAbi,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: ContractAbi },
  ): Promise<BZRXStakingInterimContract> {
    assert.isHexString('bytecode', bytecode);
    assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema, [
      schemas.addressSchema,
      schemas.numberSchema,
      schemas.jsNumber,
    ]);
    const provider = providerUtils.standardizeOrThrow(supportedProvider);
    const constructorAbi = BaseContract._lookupConstructorAbi(abi);
    [] = BaseContract._formatABIDataItemList(
      constructorAbi.inputs,
      [],
      BaseContract._bigNumberToString,
    );
    const iface = new ethers.utils.Interface(abi);
    const deployInfo = iface.deployFunction;
    const txData = deployInfo.encode(bytecode, []);
    const web3Wrapper = new Web3Wrapper(provider);
    const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
      {
        data: txData,
        ...txDefaults,
      },
      web3Wrapper.estimateGasAsync.bind(web3Wrapper),
    );
    const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
    logUtils.log(`transactionHash: ${txHash}`);
    const txReceipt = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
    logUtils.log(`BZRXStakingInterim successfully deployed at ${txReceipt.contractAddress}`);
    const contractInstance = new BZRXStakingInterimContract(txReceipt.contractAddress as string, provider, txDefaults, logDecodeDependencies);
    contractInstance.constructorArgs = [];
    return contractInstance;
  }

  /**
    * @returns      The contract ABI
    */
  public static ABI(): ContractAbi {
    const abi = [
      { 
        anonymous: false,
        inputs: [
          {
            name: 'user',
            type: 'address',
            indexed: true,
          },
          {
            name: 'oldDelegate',
            type: 'address',
            indexed: true,
          },
          {
            name: 'newDelegate',
            type: 'address',
            indexed: true,
          },
        ],
        name: 'DelegateChanged',
        outputs: [
        ],
        type: 'event',
      },
      { 
        anonymous: false,
        inputs: [
          {
            name: 'previousOwner',
            type: 'address',
            indexed: true,
          },
          {
            name: 'newOwner',
            type: 'address',
            indexed: true,
          },
        ],
        name: 'OwnershipTransferred',
        outputs: [
        ],
        type: 'event',
      },
      { 
        anonymous: false,
        inputs: [
          {
            name: 'reward',
            type: 'uint256',
            indexed: true,
          },
          {
            name: 'duration',
            type: 'uint256',
            indexed: false,
          },
        ],
        name: 'RewardAdded',
        outputs: [
        ],
        type: 'event',
      },
      { 
        anonymous: false,
        inputs: [
          {
            name: 'user',
            type: 'address',
            indexed: true,
          },
          {
            name: 'token',
            type: 'address',
            indexed: true,
          },
          {
            name: 'delegate',
            type: 'address',
            indexed: true,
          },
          {
            name: 'amount',
            type: 'uint256',
            indexed: false,
          },
        ],
        name: 'Staked',
        outputs: [
        ],
        type: 'event',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'BZRX',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'LPToken',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'token',
            type: 'address',
          },
          {
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOfByAsset',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'token',
            type: 'address',
          },
          {
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOfByAssetNormed',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'token',
            type: 'address',
          },
          {
            name: 'account',
            type: 'address',
          },
        ],
        name: 'balanceOfByAssetWalletAware',
        outputs: [
          {
            name: 'balance',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'index_0',
            type: 'address',
          },
        ],
        name: 'delegate',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        name: 'earned',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'start',
            type: 'uint256',
          },
          {
            name: 'count',
            type: 'uint256',
          },
        ],
        name: 'getRepVotes',
        outputs: [
          {
            name: 'repStakedArr',
            type: 'tuple[]',
            components: [
              {
                name: 'wallet',
                type: 'address',
              },
              {
                name: 'isActive',
                type: 'bool',
              },
              {
                name: 'BZRX',
                type: 'uint256',
              },
              {
                name: 'vBZRX',
                type: 'uint256',
              },
              {
                name: 'LPToken',
                type: 'uint256',
              },
            ]
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'iBZRX',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'implementation',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: '_BZRX',
            type: 'address',
          },
          {
            name: '_vBZRX',
            type: 'address',
          },
          {
            name: '_LPToken',
            type: 'address',
          },
          {
            name: '_isActive',
            type: 'bool',
          },
        ],
        name: 'init',
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'initialCirculatingSupply',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'isActive',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'isInit',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'isOwner',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'lastTimeRewardApplicable',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'lastUpdateTime',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: 'reward',
            type: 'uint256',
          },
          {
            name: 'duration',
            type: 'uint256',
          },
        ],
        name: 'notifyRewardAmount',
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'owner',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'periodFinish',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'index_0',
            type: 'address',
          },
          {
            name: 'index_1',
            type: 'address',
          },
        ],
        name: 'repStakedPerToken',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'index_0',
            type: 'address',
          },
        ],
        name: 'reps',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: 'token',
            type: 'address',
          },
          {
            name: 'receiver',
            type: 'address',
          },
          {
            name: 'amount',
            type: 'uint256',
          },
        ],
        name: 'rescueToken',
        outputs: [
          {
            name: 'withdrawAmount',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'rewardPerTokenStored',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'rewardRate',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'index_0',
            type: 'address',
          },
        ],
        name: 'rewards',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'rewardsPerToken',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: '_isActive',
            type: 'bool',
          },
        ],
        name: 'setActive',
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: '_isActive',
            type: 'bool',
          },
        ],
        name: 'setRepActive',
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: 'tokens',
            type: 'address[]',
          },
          {
            name: 'values',
            type: 'uint256[]',
          },
        ],
        name: 'stake',
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: 'tokens',
            type: 'address[]',
          },
          {
            name: 'values',
            type: 'uint256[]',
          },
          {
            name: 'delegateToSet',
            type: 'address',
          },
        ],
        name: 'stakeWithDelegate',
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'token',
            type: 'address',
          },
          {
            name: 'account',
            type: 'address',
          },
        ],
        name: 'stakeableByAsset',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'totalSupply',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'token',
            type: 'address',
          },
        ],
        name: 'totalSupplyByAsset',
        outputs: [
          {
            name: 'supply',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'token',
            type: 'address',
          },
        ],
        name: 'totalSupplyByAssetNormed',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'totalSupplyNormed',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: 'newOwner',
            type: 'address',
          },
        ],
        name: 'transferOwnership',
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: 'index_0',
            type: 'address',
          },
        ],
        name: 'userRewardPerTokenPaid',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
        ],
        name: 'vBZRX',
        outputs: [
          {
            name: '',
            type: 'address',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
    ] as ContractAbi;
    return abi;
  }

  protected static async _deployLibrariesAsync(
    artifact: ContractArtifact,
    libraryArtifacts: { [libraryName: string]: ContractArtifact },
    web3Wrapper: Web3Wrapper,
    txDefaults: Partial<TxData>,
    libraryAddresses: { [libraryName: string]: string } = {},
  ): Promise<{ [libraryName: string]: string }> {
    const links = artifact.compilerOutput.evm.bytecode.linkReferences;
    // Go through all linked libraries, recursively deploying them if necessary.
    for (const link of Object.values(links)) {
      for (const libraryName of Object.keys(link)) {
        if (!libraryAddresses[libraryName]) {
          // Library not yet deployed.
          const libraryArtifact = libraryArtifacts[libraryName];
          if (!libraryArtifact) {
            throw new Error(`Missing artifact for linked library "${libraryName}"`);
          }
          // Deploy any dependent libraries used by this library.
          await BZRXStakingInterimContract._deployLibrariesAsync(
            libraryArtifact,
            libraryArtifacts,
            web3Wrapper,
            txDefaults,
            libraryAddresses,
          );
          // Deploy this library.
          const linkedLibraryBytecode = linkLibrariesInBytecode(
            libraryArtifact,
            libraryAddresses,
          );
          const txDataWithDefaults = await BaseContract._applyDefaultsToContractTxDataAsync(
            {
              data: linkedLibraryBytecode,
              ...txDefaults,
            },
            web3Wrapper.estimateGasAsync.bind(web3Wrapper),
          );
          const txHash = await web3Wrapper.sendTransactionAsync(txDataWithDefaults);
          logUtils.log(`transactionHash: ${txHash}`);
          const { contractAddress } = await web3Wrapper.awaitTransactionSuccessAsync(txHash);
          logUtils.log(`${libraryArtifact.contractName} successfully deployed at ${contractAddress}`);
          libraryAddresses[libraryArtifact.contractName] = contractAddress as string;
        }
      }
    }
    return libraryAddresses;
  }

  public getFunctionSignature(methodName: string): string {
    const index = this._methodABIIndex[methodName];
    const methodAbi = BZRXStakingInterimContract.ABI()[index] as MethodAbi; // tslint:disable-line:no-unnecessary-type-assertion
    const functionSignature = methodAbiToFunctionSignature(methodAbi);
    return functionSignature;
  }

  public getABIDecodedTransactionData<T>(methodName: string, callData: string): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as BZRXStakingInterimContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecode<T>(callData);
    return abiDecodedCallData;
  }

  public getABIDecodedReturnData<T>(methodName: string, callData: string): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as BZRXStakingInterimContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecodeReturnValue<T>(callData);
    return abiDecodedCallData;
  }

  public getSelector(methodName: string): string {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as BZRXStakingInterimContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    return abiEncoder.getSelector();
  }

  public BZRX(
  ): ContractFunctionObj<string
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'BZRX()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<string
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<string
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public LPToken(
  ): ContractFunctionObj<string
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'LPToken()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<string
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<string
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public balanceOfByAsset(
        token: string,
        account: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('token', token);
      assert.isString('account', account);
    const functionSignature = 'balanceOfByAsset(address,address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [token.toLowerCase(),
      account.toLowerCase()
      ]);
      },
    }
  };
  public balanceOfByAssetNormed(
        token: string,
        account: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('token', token);
      assert.isString('account', account);
    const functionSignature = 'balanceOfByAssetNormed(address,address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [token.toLowerCase(),
      account.toLowerCase()
      ]);
      },
    }
  };
  public balanceOfByAssetWalletAware(
        token: string,
        account: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('token', token);
      assert.isString('account', account);
    const functionSignature = 'balanceOfByAssetWalletAware(address,address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [token.toLowerCase(),
      account.toLowerCase()
      ]);
      },
    }
  };
  public delegate(
        index_0: string,
  ): ContractFunctionObj<string
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('index_0', index_0);
    const functionSignature = 'delegate(address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<string
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<string
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
      ]);
      },
    }
  };
  public earned(
        account: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('account', account);
    const functionSignature = 'earned(address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [account.toLowerCase()
      ]);
      },
    }
  };
  public getRepVotes(
        start: BigNumber,
        count: BigNumber,
  ): ContractFunctionObj<Array<{wallet: string;isActive: boolean;BZRX: BigNumber;vBZRX: BigNumber;LPToken: BigNumber}>
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isBigNumber('start', start);
      assert.isBigNumber('count', count);
    const functionSignature = 'getRepVotes(uint256,uint256)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<Array<{wallet: string;isActive: boolean;BZRX: BigNumber;vBZRX: BigNumber;LPToken: BigNumber}>
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<Array<{wallet: string;isActive: boolean;BZRX: BigNumber;vBZRX: BigNumber;LPToken: BigNumber}>
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [start,
      count
      ]);
      },
    }
  };
  public iBZRX(
  ): ContractFunctionObj<string
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'iBZRX()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<string
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<string
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public implementation(
  ): ContractFunctionObj<string
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'implementation()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<string
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<string
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public init(
        _BZRX: string,
        _vBZRX: string,
        _LPToken: string,
        _isActive: boolean,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('_BZRX', _BZRX);
      assert.isString('_vBZRX', _vBZRX);
      assert.isString('_LPToken', _LPToken);
      assert.isBoolean('_isActive', _isActive);
    const functionSignature = 'init(address,address,address,bool)';

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true },
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this),
        );
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined,
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData }
        );
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<void
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<void
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [_BZRX.toLowerCase(),
      _vBZRX.toLowerCase(),
      _LPToken.toLowerCase(),
      _isActive
      ]);
      },
    }
  };
  public initialCirculatingSupply(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'initialCirculatingSupply()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public isActive(
  ): ContractFunctionObj<boolean
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'isActive()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<boolean
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<boolean
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public isInit(
  ): ContractFunctionObj<boolean
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'isInit()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<boolean
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<boolean
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public isOwner(
  ): ContractFunctionObj<boolean
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'isOwner()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<boolean
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<boolean
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public lastTimeRewardApplicable(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'lastTimeRewardApplicable()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public lastUpdateTime(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'lastUpdateTime()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public notifyRewardAmount(
        reward: BigNumber,
        duration: BigNumber,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isBigNumber('reward', reward);
      assert.isBigNumber('duration', duration);
    const functionSignature = 'notifyRewardAmount(uint256,uint256)';

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true },
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this),
        );
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined,
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData }
        );
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<void
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<void
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [reward,
      duration
      ]);
      },
    }
  };
  public owner(
  ): ContractFunctionObj<string
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'owner()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<string
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<string
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public periodFinish(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'periodFinish()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public repStakedPerToken(
        index_0: string,
        index_1: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('index_0', index_0);
      assert.isString('index_1', index_1);
    const functionSignature = 'repStakedPerToken(address,address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase(),
      index_1.toLowerCase()
      ]);
      },
    }
  };
  public reps(
        index_0: string,
  ): ContractFunctionObj<boolean
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('index_0', index_0);
    const functionSignature = 'reps(address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<boolean
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<boolean
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
      ]);
      },
    }
  };
  public rescueToken(
        token: string,
        receiver: string,
        amount: BigNumber,
  ): ContractTxFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('token', token);
      assert.isString('receiver', receiver);
      assert.isBigNumber('amount', amount);
    const functionSignature = 'rescueToken(address,address,uint256)';

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true },
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this),
        );
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined,
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData }
        );
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [token.toLowerCase(),
      receiver.toLowerCase(),
      amount
      ]);
      },
    }
  };
  public rewardPerTokenStored(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'rewardPerTokenStored()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public rewardRate(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'rewardRate()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public rewards(
        index_0: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('index_0', index_0);
    const functionSignature = 'rewards(address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
      ]);
      },
    }
  };
  public rewardsPerToken(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'rewardsPerToken()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public setActive(
        _isActive: boolean,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isBoolean('_isActive', _isActive);
    const functionSignature = 'setActive(bool)';

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true },
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this),
        );
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined,
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData }
        );
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<void
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<void
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [_isActive
      ]);
      },
    }
  };
  public setRepActive(
        _isActive: boolean,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isBoolean('_isActive', _isActive);
    const functionSignature = 'setRepActive(bool)';

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true },
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this),
        );
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined,
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData }
        );
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<void
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<void
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [_isActive
      ]);
      },
    }
  };
  public stake(
        tokens: string[],
        values: BigNumber[],
  ): ContractTxFunctionObj<void
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isArray('tokens', tokens);
      assert.isArray('values', values);
    const functionSignature = 'stake(address[],uint256[])';

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true },
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this),
        );
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined,
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData }
        );
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<void
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<void
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [tokens,
      values
      ]);
      },
    }
  };
  public stakeWithDelegate(
        tokens: string[],
        values: BigNumber[],
        delegateToSet: string,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isArray('tokens', tokens);
      assert.isArray('values', values);
      assert.isString('delegateToSet', delegateToSet);
    const functionSignature = 'stakeWithDelegate(address[],uint256[],address)';

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true },
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this),
        );
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined,
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData }
        );
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<void
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<void
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [tokens,
      values,
      delegateToSet.toLowerCase()
      ]);
      },
    }
  };
  public stakeableByAsset(
        token: string,
        account: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('token', token);
      assert.isString('account', account);
    const functionSignature = 'stakeableByAsset(address,address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [token.toLowerCase(),
      account.toLowerCase()
      ]);
      },
    }
  };
  public totalSupply(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'totalSupply()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public totalSupplyByAsset(
        token: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('token', token);
    const functionSignature = 'totalSupplyByAsset(address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [token.toLowerCase()
      ]);
      },
    }
  };
  public totalSupplyByAssetNormed(
        token: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('token', token);
    const functionSignature = 'totalSupplyByAssetNormed(address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [token.toLowerCase()
      ]);
      },
    }
  };
  public totalSupplyNormed(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'totalSupplyNormed()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public transferOwnership(
        newOwner: string,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('newOwner', newOwner);
    const functionSignature = 'transferOwnership(address)';

    return {
      async sendTransactionAsync(
        txData?: Partial<TxData> | undefined,
        opts: SendTransactionOpts = { shouldValidate: true },
      ): Promise<string> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData },
          this.estimateGasAsync.bind(this),
        );
        return self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      },
      awaitTransactionSuccessAsync(
        txData?: Partial<TxData>,
        opts: AwaitTransactionSuccessOpts = { shouldValidate: true },
      ): PromiseWithTransactionHash<TransactionReceiptWithDecodedLogs> {
        return self._promiseWithTransactionHash(this.sendTransactionAsync(txData, opts), opts);
      },
      async estimateGasAsync(
        txData?: Partial<TxData> | undefined,
      ): Promise<number> {
        const txDataWithDefaults = await self._applyDefaultsToTxDataAsync(
          { data: this.getABIEncodedTransactionData(), ...txData }
        );
        return self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
      },
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<void
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<void
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [newOwner.toLowerCase()
      ]);
      },
    }
  };
  public userRewardPerTokenPaid(
        index_0: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as BZRXStakingInterimContract;
      assert.isString('index_0', index_0);
    const functionSignature = 'userRewardPerTokenPaid(address)';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<BigNumber
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<BigNumber
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [index_0.toLowerCase()
      ]);
      },
    }
  };
  public vBZRX(
  ): ContractFunctionObj<string
> {
    const self = this as any as BZRXStakingInterimContract;
    const functionSignature = 'vBZRX()';

    return {
      async callAsync(
        callData: Partial<CallData> = {},
        defaultBlock?: BlockParam,
      ): Promise<string
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<string
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };

  /**
    * Subscribe to an event type emitted by the BZRXStakingInterim contract.
    * @param eventName The BZRXStakingInterim contract event you would like to subscribe to.
    * @param indexFilterValues An object where the keys are indexed args returned by the event and
    * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
    * @param callback Callback that gets called when a log is added/removed
    * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
    * @return Subscription token used later to unsubscribe
    */
  public subscribe<ArgsType extends BZRXStakingInterimEventArgs>(
    eventName: BZRXStakingInterimEvents,
    indexFilterValues: IndexedFilterValues,
    callback: EventCallback<ArgsType>,
    isVerbose: boolean = false,
    blockPollingIntervalMs?: number,
  ): string {
    assert.doesBelongToStringEnum('eventName', eventName, BZRXStakingInterimEvents);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', callback);
    const subscriptionToken = this._subscriptionManager.subscribe<ArgsType>(
      this.address,
      eventName,
      indexFilterValues,
      BZRXStakingInterimContract.ABI(),
      callback,
      isVerbose,
      blockPollingIntervalMs,
    );
    return subscriptionToken;
  }

  /**
    * Cancel a subscription
    * @param subscriptionToken Subscription token returned by `subscribe()`
    */
  public unsubscribe(subscriptionToken: string): void {
    this._subscriptionManager.unsubscribe(subscriptionToken);
  }

  /**
    * Cancels all existing subscriptions
    */
  public unsubscribeAll(): void {
    this._subscriptionManager.unsubscribeAll();
  }

  /**
    * Gets historical logs without creating a subscription
    * @param eventName The BZRXStakingInterim contract event you would like to subscribe to.
    * @param blockRange Block range to get logs from.
    * @param indexFilterValues An object where the keys are indexed args returned by the event and
    * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
    * @return Array of logs that match the parameters
    */
  public async getLogsAsync<ArgsType extends BZRXStakingInterimEventArgs>(
    eventName: BZRXStakingInterimEvents,
    blockRange: BlockRange,
    indexFilterValues: IndexedFilterValues,
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> {
    assert.doesBelongToStringEnum('eventName', eventName, BZRXStakingInterimEvents);
    assert.doesConformToSchema('blockRange', blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    const logs = await this._subscriptionManager.getLogsAsync<ArgsType>(
      this.address,
      eventName,
      blockRange,
      indexFilterValues,
      BZRXStakingInterimContract.ABI(),
    );
    return logs;
  }

  constructor(
    address: string,
    supportedProvider: SupportedProvider,
    txDefaults?: Partial<TxData>,
    logDecodeDependencies?: { [contractName: string]: ContractAbi },
    deployedBytecode: string | undefined = BZRXStakingInterimContract.deployedBytecode,
  ) {
    super('BZRXStakingInterim', BZRXStakingInterimContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode);
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
this._subscriptionManager = new SubscriptionManager<BZRXStakingInterimEventArgs, BZRXStakingInterimEvents>(
      BZRXStakingInterimContract.ABI(),
      this._web3Wrapper,
    );
BZRXStakingInterimContract.ABI().forEach((item, index) => {
      if (item.type === 'function') {
        const methodAbi = item as MethodAbi;
        this._methodABIIndex[methodAbi.name] = index;
      }
    });
  }
}

// tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method no-parameter-reassignment no-consecutive-blank-lines ordered-imports align
// tslint:enable:trailing-comma whitespace no-trailing-whitespace
