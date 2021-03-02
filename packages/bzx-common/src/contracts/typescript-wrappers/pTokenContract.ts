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


export type pTokenEventArgs =
  | pTokenTransferEventArgs
  | pTokenApprovalEventArgs
  | pTokenMintEventArgs
  | pTokenBurnEventArgs
  | pTokenOwnershipTransferredEventArgs;

export enum pTokenEvents {
  Transfer = 'Transfer',
  Approval = 'Approval',
  Mint = 'Mint',
  Burn = 'Burn',
  OwnershipTransferred = 'OwnershipTransferred',
}

export interface pTokenTransferEventArgs extends DecodedLogArgs {
  from: string;
  to: string;
  value: BigNumber;
}

export interface pTokenApprovalEventArgs extends DecodedLogArgs {
  owner: string;
  spender: string;
  value: BigNumber;
}

export interface pTokenMintEventArgs extends DecodedLogArgs {
  minter: string;
  depositAddress: string;
  depositAmount: BigNumber;
  tokenAmount: BigNumber;
  price: BigNumber;
}

export interface pTokenBurnEventArgs extends DecodedLogArgs {
  burner: string;
  withdrawalAddress: string;
  withdrawalAmount: BigNumber;
  tokenAmount: BigNumber;
  price: BigNumber;
}

export interface pTokenOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string;
  newOwner: string;
}


/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class pTokenContract extends BaseContract {
  /**
    * @ignore
    */
public static deployedBytecode: string | undefined;
public static contractName = 'pToken';
  private readonly _methodABIIndex: { [name: string]: number } = {};
private readonly _subscriptionManager: SubscriptionManager<pTokenEventArgs, pTokenEvents>;
public static async deployFrom0xArtifactAsync(
    artifact: ContractArtifact | SimpleContractArtifact,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
  ): Promise<pTokenContract> {
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
    return pTokenContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
  }

  public static async deployWithLibrariesFrom0xArtifactAsync(
    artifact: ContractArtifact,
    libraryArtifacts: { [libraryName: string]: ContractArtifact },
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
  ): Promise<pTokenContract> {
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
    const libraryAddresses = await pTokenContract._deployLibrariesAsync(
      artifact,
      libraryArtifacts,
      new Web3Wrapper(provider),
      txDefaults
    );
    const bytecode = linkLibrariesInBytecode(
      artifact,
      libraryAddresses,
    );
    return pTokenContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
  }

  public static async deployAsync(
    bytecode: string,
    abi: ContractAbi,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: ContractAbi },
  ): Promise<pTokenContract> {
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
    logUtils.log(`pToken successfully deployed at ${txReceipt.contractAddress}`);
    const contractInstance = new pTokenContract(txReceipt.contractAddress as string, provider, txDefaults, logDecodeDependencies);
    contractInstance.constructorArgs = [];
    return contractInstance;
  }

  /**
    * @returns      The contract ABI
    */
  public static ABI(): ContractAbi {
    const abi = [
      { 
        constant: true,
        inputs: [
        ],
        name: 'tradeTokenDecimals',
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
        name: 'name',
        outputs: [
          {
            name: '',
            type: 'string',
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
            name: '_spender',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'approve',
        outputs: [
          {
            name: '',
            type: 'bool',
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
        name: 'tradeTokenAdjustment',
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
        ],
        name: 'initialPrice',
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
            name: '_isPaused',
            type: 'bool',
          },
        ],
        name: 'pauseBurning',
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
        name: 'decimals',
        outputs: [
          {
            name: '',
            type: 'uint8',
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
            name: '_isPaused',
            type: 'bool',
          },
        ],
        name: 'pauseMinting',
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
        name: 'wethContract',
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
        name: 'loanTokenLender',
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
            name: '_spender',
            type: 'address',
          },
          {
            name: '_subtractedValue',
            type: 'uint256',
          },
        ],
        name: 'decreaseApproval',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: true,
        inputs: [
          {
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'balanceOf',
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
        name: 'loanToken',
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
        name: 'burningPaused',
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
        name: 'bZxVault',
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
        name: 'totalSurplus',
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
        name: 'symbol',
        outputs: [
          {
            name: '',
            type: 'string',
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
        name: 'bZxOracle',
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
        name: 'totalDeficit',
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
        name: 'bZxContract',
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
        name: 'splitFactor',
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
        name: 'leverageAmount',
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
        name: 'tradeTokenAddress',
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
        name: 'loanTokenAdjustment',
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
        name: 'shortPosition',
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
          {
            name: 'index_0',
            type: 'address',
          },
        ],
        name: 'userSurplus',
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
            name: '_spender',
            type: 'address',
          },
          {
            name: '_addedValue',
            type: 'uint256',
          },
        ],
        name: 'increaseApproval',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
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
        name: 'userDeficit',
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
            name: '_owner',
            type: 'address',
          },
          {
            name: '_spender',
            type: 'address',
          },
        ],
        name: 'allowance',
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
        name: 'mintingPaused',
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
        name: 'loanTokenDecimals',
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
            name: '_newOwner',
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
        ],
        name: 'loanId',
        outputs: [
          {
            name: '',
            type: 'bytes32',
          },
        ],
        payable: false,
        stateMutability: 'view',
        type: 'function',
      },
      { 
        inputs: [
        ],
        outputs: [
        ],
        payable: true,
        stateMutability: 'payable',
        type: 'fallback',
      },
      { 
        anonymous: false,
        inputs: [
          {
            name: 'from',
            type: 'address',
            indexed: true,
          },
          {
            name: 'to',
            type: 'address',
            indexed: true,
          },
          {
            name: 'value',
            type: 'uint256',
            indexed: false,
          },
        ],
        name: 'Transfer',
        outputs: [
        ],
        type: 'event',
      },
      { 
        anonymous: false,
        inputs: [
          {
            name: 'owner',
            type: 'address',
            indexed: true,
          },
          {
            name: 'spender',
            type: 'address',
            indexed: true,
          },
          {
            name: 'value',
            type: 'uint256',
            indexed: false,
          },
        ],
        name: 'Approval',
        outputs: [
        ],
        type: 'event',
      },
      { 
        anonymous: false,
        inputs: [
          {
            name: 'minter',
            type: 'address',
            indexed: true,
          },
          {
            name: 'depositAddress',
            type: 'address',
            indexed: true,
          },
          {
            name: 'depositAmount',
            type: 'uint256',
            indexed: false,
          },
          {
            name: 'tokenAmount',
            type: 'uint256',
            indexed: false,
          },
          {
            name: 'price',
            type: 'uint256',
            indexed: false,
          },
        ],
        name: 'Mint',
        outputs: [
        ],
        type: 'event',
      },
      { 
        anonymous: false,
        inputs: [
          {
            name: 'burner',
            type: 'address',
            indexed: true,
          },
          {
            name: 'withdrawalAddress',
            type: 'address',
            indexed: true,
          },
          {
            name: 'withdrawalAmount',
            type: 'uint256',
            indexed: false,
          },
          {
            name: 'tokenAmount',
            type: 'uint256',
            indexed: false,
          },
          {
            name: 'price',
            type: 'uint256',
            indexed: false,
          },
        ],
        name: 'Burn',
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
        constant: false,
        inputs: [
          {
            name: 'receiver',
            type: 'address',
          },
          {
            name: 'maxPriceAllowed',
            type: 'uint256',
          },
        ],
        name: 'mintWithEther',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: true,
        stateMutability: 'payable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: 'receiver',
            type: 'address',
          },
          {
            name: 'depositTokenAddress',
            type: 'address',
          },
          {
            name: 'depositAmount',
            type: 'uint256',
          },
          {
            name: 'maxPriceAllowed',
            type: 'uint256',
          },
        ],
        name: 'mintWithToken',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: 'receiver',
            type: 'address',
          },
          {
            name: 'burnAmount',
            type: 'uint256',
          },
          {
            name: 'minPriceAllowed',
            type: 'uint256',
          },
        ],
        name: 'burnToEther',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: 'receiver',
            type: 'address',
          },
          {
            name: 'burnTokenAddress',
            type: 'address',
          },
          {
            name: 'burnAmount',
            type: 'uint256',
          },
          {
            name: 'minPriceAllowed',
            type: 'uint256',
          },
        ],
        name: 'burnToToken',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: 'tokenAddress',
            type: 'address',
          },
        ],
        name: 'donateAsset',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: '_from',
            type: 'address',
          },
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transferFrom',
        outputs: [
          {
            name: '',
            type: 'bool',
          },
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
          {
            name: '_to',
            type: 'address',
          },
          {
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'transfer',
        outputs: [
          {
            name: '',
            type: 'bool',
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
        name: 'tokenPrice',
        outputs: [
          {
            name: 'price',
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
        name: 'liquidationPrice',
        outputs: [
          {
            name: 'price',
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
            name: '_user',
            type: 'address',
          },
        ],
        name: 'checkpointPrice',
        outputs: [
          {
            name: 'price',
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
        name: 'currentLeverage',
        outputs: [
          {
            name: 'leverage',
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
        name: 'marketLiquidityForLoan',
        outputs: [
          {
            name: 'value',
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
        name: 'getMaxDepositAmount',
        outputs: [
          {
            name: 'value',
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
            name: '_owner',
            type: 'address',
          },
        ],
        name: 'positionValue',
        outputs: [
          {
            name: 'value',
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
        name: 'positionTokenPrice',
        outputs: [
          {
            name: 'price',
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
            name: '_lender',
            type: 'address',
          },
        ],
        name: 'setLoanTokenLender',
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
            name: '_addr',
            type: 'address',
          },
        ],
        name: 'setBZxContract',
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
            name: '_addr',
            type: 'address',
          },
        ],
        name: 'setBZxVault',
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
            name: '_addr',
            type: 'address',
          },
        ],
        name: 'setBZxOracle',
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
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'setInitialPrice',
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
            name: '_value',
            type: 'uint256',
          },
        ],
        name: 'setSplitValue',
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'function',
      },
      { 
        constant: false,
        inputs: [
        ],
        name: 'handleSplit',
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
            name: 'depositTokenAddress',
            type: 'address',
          },
          {
            name: 'depositAmount',
            type: 'uint256',
          },
        ],
        name: 'depositCollateralToLoan',
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
            name: 'openPosition',
            type: 'bool',
          },
        ],
        name: 'triggerPosition',
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
            name: 'addresses',
            type: 'address[7]',
          },
          {
            name: '_shortPosition',
            type: 'bool',
          },
          {
            name: '_leverageAmount',
            type: 'uint256',
          },
          {
            name: '_loanId',
            type: 'bytes32',
          },
          {
            name: '_name',
            type: 'string',
          },
          {
            name: '_symbol',
            type: 'string',
          },
        ],
        name: 'initialize',
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
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
          await pTokenContract._deployLibrariesAsync(
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
    const methodAbi = pTokenContract.ABI()[index] as MethodAbi; // tslint:disable-line:no-unnecessary-type-assertion
    const functionSignature = methodAbiToFunctionSignature(methodAbi);
    return functionSignature;
  }

  public getABIDecodedTransactionData<T>(methodName: string, callData: string): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as pTokenContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecode<T>(callData);
    return abiDecodedCallData;
  }

  public getABIDecodedReturnData<T>(methodName: string, callData: string): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as pTokenContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecodeReturnValue<T>(callData);
    return abiDecodedCallData;
  }

  public getSelector(methodName: string): string {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as pTokenContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    return abiEncoder.getSelector();
  }

  public tradeTokenDecimals(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'tradeTokenDecimals()';

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
  public name(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'name()';

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
  public approve(
        _spender: string,
        _value: BigNumber,
  ): ContractTxFunctionObj<boolean
> {
    const self = this as any as pTokenContract;
      assert.isString('_spender', _spender);
      assert.isBigNumber('_value', _value);
    const functionSignature = 'approve(address,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [_spender.toLowerCase(),
      _value
      ]);
      },
    }
  };
  public tradeTokenAdjustment(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'tradeTokenAdjustment()';

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
  public totalSupply(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
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
  public initialPrice(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'initialPrice()';

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
  public pauseBurning(
        _isPaused: boolean,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isBoolean('_isPaused', _isPaused);
    const functionSignature = 'pauseBurning(bool)';

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
        return self._strictEncodeArguments(functionSignature, [_isPaused
      ]);
      },
    }
  };
  public decimals(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'decimals()';

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
  public pauseMinting(
        _isPaused: boolean,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isBoolean('_isPaused', _isPaused);
    const functionSignature = 'pauseMinting(bool)';

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
        return self._strictEncodeArguments(functionSignature, [_isPaused
      ]);
      },
    }
  };
  public wethContract(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'wethContract()';

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
  public loanTokenLender(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'loanTokenLender()';

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
  public decreaseApproval(
        _spender: string,
        _subtractedValue: BigNumber,
  ): ContractTxFunctionObj<boolean
> {
    const self = this as any as pTokenContract;
      assert.isString('_spender', _spender);
      assert.isBigNumber('_subtractedValue', _subtractedValue);
    const functionSignature = 'decreaseApproval(address,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [_spender.toLowerCase(),
      _subtractedValue
      ]);
      },
    }
  };
  public balanceOf(
        _owner: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('_owner', _owner);
    const functionSignature = 'balanceOf(address)';

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
        return self._strictEncodeArguments(functionSignature, [_owner.toLowerCase()
      ]);
      },
    }
  };
  public loanToken(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'loanToken()';

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
  public burningPaused(
  ): ContractFunctionObj<boolean
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'burningPaused()';

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
  public bZxVault(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'bZxVault()';

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
  public owner(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
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
  public totalSurplus(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'totalSurplus()';

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
  public symbol(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'symbol()';

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
  public bZxOracle(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'bZxOracle()';

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
  public totalDeficit(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'totalDeficit()';

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
  public bZxContract(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'bZxContract()';

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
  public splitFactor(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'splitFactor()';

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
  public leverageAmount(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'leverageAmount()';

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
  public tradeTokenAddress(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'tradeTokenAddress()';

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
  public loanTokenAdjustment(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'loanTokenAdjustment()';

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
  public shortPosition(
  ): ContractFunctionObj<boolean
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'shortPosition()';

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
  public userSurplus(
        index_0: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('index_0', index_0);
    const functionSignature = 'userSurplus(address)';

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
  public increaseApproval(
        _spender: string,
        _addedValue: BigNumber,
  ): ContractTxFunctionObj<boolean
> {
    const self = this as any as pTokenContract;
      assert.isString('_spender', _spender);
      assert.isBigNumber('_addedValue', _addedValue);
    const functionSignature = 'increaseApproval(address,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [_spender.toLowerCase(),
      _addedValue
      ]);
      },
    }
  };
  public userDeficit(
        index_0: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('index_0', index_0);
    const functionSignature = 'userDeficit(address)';

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
  public allowance(
        _owner: string,
        _spender: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('_owner', _owner);
      assert.isString('_spender', _spender);
    const functionSignature = 'allowance(address,address)';

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
        return self._strictEncodeArguments(functionSignature, [_owner.toLowerCase(),
      _spender.toLowerCase()
      ]);
      },
    }
  };
  public mintingPaused(
  ): ContractFunctionObj<boolean
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'mintingPaused()';

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
  public loanTokenDecimals(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'loanTokenDecimals()';

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
        _newOwner: string,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isString('_newOwner', _newOwner);
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
        return self._strictEncodeArguments(functionSignature, [_newOwner.toLowerCase()
      ]);
      },
    }
  };
  public loanId(
  ): ContractFunctionObj<string
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'loanId()';

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
  public mintWithEther(
        receiver: string,
        maxPriceAllowed: BigNumber,
  ): ContractTxFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('receiver', receiver);
      assert.isBigNumber('maxPriceAllowed', maxPriceAllowed);
    const functionSignature = 'mintWithEther(address,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [receiver.toLowerCase(),
      maxPriceAllowed
      ]);
      },
    }
  };
  public mintWithToken(
        receiver: string,
        depositTokenAddress: string,
        depositAmount: BigNumber,
        maxPriceAllowed: BigNumber,
  ): ContractTxFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('receiver', receiver);
      assert.isString('depositTokenAddress', depositTokenAddress);
      assert.isBigNumber('depositAmount', depositAmount);
      assert.isBigNumber('maxPriceAllowed', maxPriceAllowed);
    const functionSignature = 'mintWithToken(address,address,uint256,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [receiver.toLowerCase(),
      depositTokenAddress.toLowerCase(),
      depositAmount,
      maxPriceAllowed
      ]);
      },
    }
  };
  public burnToEther(
        receiver: string,
        burnAmount: BigNumber,
        minPriceAllowed: BigNumber,
  ): ContractTxFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('receiver', receiver);
      assert.isBigNumber('burnAmount', burnAmount);
      assert.isBigNumber('minPriceAllowed', minPriceAllowed);
    const functionSignature = 'burnToEther(address,uint256,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [receiver.toLowerCase(),
      burnAmount,
      minPriceAllowed
      ]);
      },
    }
  };
  public burnToToken(
        receiver: string,
        burnTokenAddress: string,
        burnAmount: BigNumber,
        minPriceAllowed: BigNumber,
  ): ContractTxFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('receiver', receiver);
      assert.isString('burnTokenAddress', burnTokenAddress);
      assert.isBigNumber('burnAmount', burnAmount);
      assert.isBigNumber('minPriceAllowed', minPriceAllowed);
    const functionSignature = 'burnToToken(address,address,uint256,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [receiver.toLowerCase(),
      burnTokenAddress.toLowerCase(),
      burnAmount,
      minPriceAllowed
      ]);
      },
    }
  };
  public donateAsset(
        tokenAddress: string,
  ): ContractTxFunctionObj<boolean
> {
    const self = this as any as pTokenContract;
      assert.isString('tokenAddress', tokenAddress);
    const functionSignature = 'donateAsset(address)';

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
        return self._strictEncodeArguments(functionSignature, [tokenAddress.toLowerCase()
      ]);
      },
    }
  };
  public transferFrom(
        _from: string,
        _to: string,
        _value: BigNumber,
  ): ContractTxFunctionObj<boolean
> {
    const self = this as any as pTokenContract;
      assert.isString('_from', _from);
      assert.isString('_to', _to);
      assert.isBigNumber('_value', _value);
    const functionSignature = 'transferFrom(address,address,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [_from.toLowerCase(),
      _to.toLowerCase(),
      _value
      ]);
      },
    }
  };
  public transfer(
        _to: string,
        _value: BigNumber,
  ): ContractTxFunctionObj<boolean
> {
    const self = this as any as pTokenContract;
      assert.isString('_to', _to);
      assert.isBigNumber('_value', _value);
    const functionSignature = 'transfer(address,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [_to.toLowerCase(),
      _value
      ]);
      },
    }
  };
  public tokenPrice(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'tokenPrice()';

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
  public liquidationPrice(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'liquidationPrice()';

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
  public checkpointPrice(
        _user: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('_user', _user);
    const functionSignature = 'checkpointPrice(address)';

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
        return self._strictEncodeArguments(functionSignature, [_user.toLowerCase()
      ]);
      },
    }
  };
  public currentLeverage(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'currentLeverage()';

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
  public marketLiquidityForLoan(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'marketLiquidityForLoan()';

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
  public getMaxDepositAmount(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'getMaxDepositAmount()';

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
  public positionValue(
        _owner: string,
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
      assert.isString('_owner', _owner);
    const functionSignature = 'positionValue(address)';

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
        return self._strictEncodeArguments(functionSignature, [_owner.toLowerCase()
      ]);
      },
    }
  };
  public positionTokenPrice(
  ): ContractFunctionObj<BigNumber
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'positionTokenPrice()';

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
  public setLoanTokenLender(
        _lender: string,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isString('_lender', _lender);
    const functionSignature = 'setLoanTokenLender(address)';

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
        return self._strictEncodeArguments(functionSignature, [_lender.toLowerCase()
      ]);
      },
    }
  };
  public setBZxContract(
        _addr: string,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isString('_addr', _addr);
    const functionSignature = 'setBZxContract(address)';

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
        return self._strictEncodeArguments(functionSignature, [_addr.toLowerCase()
      ]);
      },
    }
  };
  public setBZxVault(
        _addr: string,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isString('_addr', _addr);
    const functionSignature = 'setBZxVault(address)';

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
        return self._strictEncodeArguments(functionSignature, [_addr.toLowerCase()
      ]);
      },
    }
  };
  public setBZxOracle(
        _addr: string,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isString('_addr', _addr);
    const functionSignature = 'setBZxOracle(address)';

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
        return self._strictEncodeArguments(functionSignature, [_addr.toLowerCase()
      ]);
      },
    }
  };
  public setInitialPrice(
        _value: BigNumber,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isBigNumber('_value', _value);
    const functionSignature = 'setInitialPrice(uint256)';

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
        return self._strictEncodeArguments(functionSignature, [_value
      ]);
      },
    }
  };
  public setSplitValue(
        _value: BigNumber,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isBigNumber('_value', _value);
    const functionSignature = 'setSplitValue(uint256)';

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
        return self._strictEncodeArguments(functionSignature, [_value
      ]);
      },
    }
  };
  public handleSplit(
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
    const functionSignature = 'handleSplit()';

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
        return self._strictEncodeArguments(functionSignature, []);
      },
    }
  };
  public depositCollateralToLoan(
        depositTokenAddress: string,
        depositAmount: BigNumber,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isString('depositTokenAddress', depositTokenAddress);
      assert.isBigNumber('depositAmount', depositAmount);
    const functionSignature = 'depositCollateralToLoan(address,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [depositTokenAddress.toLowerCase(),
      depositAmount
      ]);
      },
    }
  };
  public triggerPosition(
        openPosition: boolean,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isBoolean('openPosition', openPosition);
    const functionSignature = 'triggerPosition(bool)';

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
        return self._strictEncodeArguments(functionSignature, [openPosition
      ]);
      },
    }
  };
  public initialize(
        addresses: string[],
        _shortPosition: boolean,
        _leverageAmount: BigNumber,
        _loanId: string,
        _name: string,
        _symbol: string,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as pTokenContract;
      assert.isArray('addresses', addresses);
      assert.isBoolean('_shortPosition', _shortPosition);
      assert.isBigNumber('_leverageAmount', _leverageAmount);
      assert.isString('_loanId', _loanId);
      assert.isString('_name', _name);
      assert.isString('_symbol', _symbol);
    const functionSignature = 'initialize(address[7],bool,uint256,bytes32,string,string)';

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
        return self._strictEncodeArguments(functionSignature, [addresses,
      _shortPosition,
      _leverageAmount,
      _loanId,
      _name,
      _symbol
      ]);
      },
    }
  };

  /**
    * Subscribe to an event type emitted by the pToken contract.
    * @param eventName The pToken contract event you would like to subscribe to.
    * @param indexFilterValues An object where the keys are indexed args returned by the event and
    * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
    * @param callback Callback that gets called when a log is added/removed
    * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
    * @return Subscription token used later to unsubscribe
    */
  public subscribe<ArgsType extends pTokenEventArgs>(
    eventName: pTokenEvents,
    indexFilterValues: IndexedFilterValues,
    callback: EventCallback<ArgsType>,
    isVerbose: boolean = false,
    blockPollingIntervalMs?: number,
  ): string {
    assert.doesBelongToStringEnum('eventName', eventName, pTokenEvents);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', callback);
    const subscriptionToken = this._subscriptionManager.subscribe<ArgsType>(
      this.address,
      eventName,
      indexFilterValues,
      pTokenContract.ABI(),
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
    * @param eventName The pToken contract event you would like to subscribe to.
    * @param blockRange Block range to get logs from.
    * @param indexFilterValues An object where the keys are indexed args returned by the event and
    * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
    * @return Array of logs that match the parameters
    */
  public async getLogsAsync<ArgsType extends pTokenEventArgs>(
    eventName: pTokenEvents,
    blockRange: BlockRange,
    indexFilterValues: IndexedFilterValues,
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> {
    assert.doesBelongToStringEnum('eventName', eventName, pTokenEvents);
    assert.doesConformToSchema('blockRange', blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    const logs = await this._subscriptionManager.getLogsAsync<ArgsType>(
      this.address,
      eventName,
      blockRange,
      indexFilterValues,
      pTokenContract.ABI(),
    );
    return logs;
  }

  constructor(
    address: string,
    supportedProvider: SupportedProvider,
    txDefaults?: Partial<TxData>,
    logDecodeDependencies?: { [contractName: string]: ContractAbi },
    deployedBytecode: string | undefined = pTokenContract.deployedBytecode,
  ) {
    super('pToken', pTokenContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode);
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
this._subscriptionManager = new SubscriptionManager<pTokenEventArgs, pTokenEvents>(
      pTokenContract.ABI(),
      this._web3Wrapper,
    );
pTokenContract.ABI().forEach((item, index) => {
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
