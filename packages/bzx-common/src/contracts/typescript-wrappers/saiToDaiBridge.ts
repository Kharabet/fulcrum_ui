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


export type saiToDAIBridgeEventArgs =
  | saiToDAIBridgeOwnershipTransferredEventArgs;

export enum saiToDAIBridgeEvents {
  OwnershipTransferred = 'OwnershipTransferred',
}

export interface saiToDAIBridgeOwnershipTransferredEventArgs extends DecodedLogArgs {
  previousOwner: string;
  newOwner: string;
}


/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class saiToDAIBridgeContract extends BaseContract {
  /**
    * @ignore
    */
public static deployedBytecode: string | undefined;
public static contractName = 'saiToDAIBridge';
  private readonly _methodABIIndex: { [name: string]: number } = {};
private readonly _subscriptionManager: SubscriptionManager<saiToDAIBridgeEventArgs, saiToDAIBridgeEvents>;
public static async deployFrom0xArtifactAsync(
    artifact: ContractArtifact | SimpleContractArtifact,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
      _iBZx: string,
      _iDai: string,
      _migration: string,
  ): Promise<saiToDAIBridgeContract> {
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
    return saiToDAIBridgeContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, _iBZx,
_iDai,
_migration
);
  }

  public static async deployWithLibrariesFrom0xArtifactAsync(
    artifact: ContractArtifact,
    libraryArtifacts: { [libraryName: string]: ContractArtifact },
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
      _iBZx: string,
      _iDai: string,
      _migration: string,
  ): Promise<saiToDAIBridgeContract> {
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
    const libraryAddresses = await saiToDAIBridgeContract._deployLibrariesAsync(
      artifact,
      libraryArtifacts,
      new Web3Wrapper(provider),
      txDefaults
    );
    const bytecode = linkLibrariesInBytecode(
      artifact,
      libraryAddresses,
    );
    return saiToDAIBridgeContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, _iBZx,
_iDai,
_migration
);
  }

  public static async deployAsync(
    bytecode: string,
    abi: ContractAbi,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: ContractAbi },
      _iBZx: string,
      _iDai: string,
      _migration: string,
  ): Promise<saiToDAIBridgeContract> {
    assert.isHexString('bytecode', bytecode);
    assert.doesConformToSchema('txDefaults', txDefaults, schemas.txDataSchema, [
      schemas.addressSchema,
      schemas.numberSchema,
      schemas.jsNumber,
    ]);
    const provider = providerUtils.standardizeOrThrow(supportedProvider);
    const constructorAbi = BaseContract._lookupConstructorAbi(abi);
    [_iBZx,
_iDai,
_migration
] = BaseContract._formatABIDataItemList(
      constructorAbi.inputs,
      [_iBZx,
_iDai,
_migration
],
      BaseContract._bigNumberToString,
    );
    const iface = new ethers.utils.Interface(abi);
    const deployInfo = iface.deployFunction;
    const txData = deployInfo.encode(bytecode, [_iBZx,
_iDai,
_migration
]);
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
    logUtils.log(`saiToDAIBridge successfully deployed at ${txReceipt.contractAddress}`);
    const contractInstance = new saiToDAIBridgeContract(txReceipt.contractAddress as string, provider, txDefaults, logDecodeDependencies);
    contractInstance.constructorArgs = [_iBZx,
_iDai,
_migration
];
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
        name: 'migration',
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
        name: 'iDai',
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
        name: 'iBZx',
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
            name: 'loanId',
            type: 'bytes32',
          },
          {
            name: 'borrower',
            type: 'address',
          },
          {
            name: 'migrationAmount',
            type: 'uint256',
          },
        ],
        name: '_migrateLoan',
        outputs: [
        ],
        payable: true,
        stateMutability: 'payable',
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
        constant: false,
        inputs: [
          {
            name: 'loanId',
            type: 'bytes32',
          },
          {
            name: 'migrationAmount',
            type: 'uint256',
          },
        ],
        name: 'migrateLoan',
        outputs: [
        ],
        payable: true,
        stateMutability: 'payable',
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
        inputs: [
          {
            name: '_iBZx',
            type: 'address',
          },
          {
            name: '_iDai',
            type: 'address',
          },
          {
            name: '_migration',
            type: 'address',
          },
        ],
        outputs: [
        ],
        payable: false,
        stateMutability: 'nonpayable',
        type: 'constructor',
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
          await saiToDAIBridgeContract._deployLibrariesAsync(
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
    const methodAbi = saiToDAIBridgeContract.ABI()[index] as MethodAbi; // tslint:disable-line:no-unnecessary-type-assertion
    const functionSignature = methodAbiToFunctionSignature(methodAbi);
    return functionSignature;
  }

  public getABIDecodedTransactionData<T>(methodName: string, callData: string): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as saiToDAIBridgeContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecode<T>(callData);
    return abiDecodedCallData;
  }

  public getABIDecodedReturnData<T>(methodName: string, callData: string): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as saiToDAIBridgeContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecodeReturnValue<T>(callData);
    return abiDecodedCallData;
  }

  public getSelector(methodName: string): string {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as saiToDAIBridgeContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    return abiEncoder.getSelector();
  }

  public migration(
  ): ContractFunctionObj<string
> {
    const self = this as any as saiToDAIBridgeContract;
    const functionSignature = 'migration()';

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
  public iDai(
  ): ContractFunctionObj<string
> {
    const self = this as any as saiToDAIBridgeContract;
    const functionSignature = 'iDai()';

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
  public iBZx(
  ): ContractFunctionObj<string
> {
    const self = this as any as saiToDAIBridgeContract;
    const functionSignature = 'iBZx()';

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
  public _migrateLoan(
        loanId: string,
        borrower: string,
        migrationAmount: BigNumber,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as saiToDAIBridgeContract;
      assert.isString('loanId', loanId);
      assert.isString('borrower', borrower);
      assert.isBigNumber('migrationAmount', migrationAmount);
    const functionSignature = '_migrateLoan(bytes32,address,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [loanId,
      borrower.toLowerCase(),
      migrationAmount
      ]);
      },
    }
  };
  public owner(
  ): ContractFunctionObj<string
> {
    const self = this as any as saiToDAIBridgeContract;
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
  public migrateLoan(
        loanId: string,
        migrationAmount: BigNumber,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as saiToDAIBridgeContract;
      assert.isString('loanId', loanId);
      assert.isBigNumber('migrationAmount', migrationAmount);
    const functionSignature = 'migrateLoan(bytes32,uint256)';

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
        return self._strictEncodeArguments(functionSignature, [loanId,
      migrationAmount
      ]);
      },
    }
  };
  public transferOwnership(
        _newOwner: string,
  ): ContractTxFunctionObj<void
> {
    const self = this as any as saiToDAIBridgeContract;
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

  /**
    * Subscribe to an event type emitted by the saiToDAIBridge contract.
    * @param eventName The saiToDAIBridge contract event you would like to subscribe to.
    * @param indexFilterValues An object where the keys are indexed args returned by the event and
    * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
    * @param callback Callback that gets called when a log is added/removed
    * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
    * @return Subscription token used later to unsubscribe
    */
  public subscribe<ArgsType extends saiToDAIBridgeEventArgs>(
    eventName: saiToDAIBridgeEvents,
    indexFilterValues: IndexedFilterValues,
    callback: EventCallback<ArgsType>,
    isVerbose: boolean = false,
    blockPollingIntervalMs?: number,
  ): string {
    assert.doesBelongToStringEnum('eventName', eventName, saiToDAIBridgeEvents);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', callback);
    const subscriptionToken = this._subscriptionManager.subscribe<ArgsType>(
      this.address,
      eventName,
      indexFilterValues,
      saiToDAIBridgeContract.ABI(),
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
    * @param eventName The saiToDAIBridge contract event you would like to subscribe to.
    * @param blockRange Block range to get logs from.
    * @param indexFilterValues An object where the keys are indexed args returned by the event and
    * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
    * @return Array of logs that match the parameters
    */
  public async getLogsAsync<ArgsType extends saiToDAIBridgeEventArgs>(
    eventName: saiToDAIBridgeEvents,
    blockRange: BlockRange,
    indexFilterValues: IndexedFilterValues,
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> {
    assert.doesBelongToStringEnum('eventName', eventName, saiToDAIBridgeEvents);
    assert.doesConformToSchema('blockRange', blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    const logs = await this._subscriptionManager.getLogsAsync<ArgsType>(
      this.address,
      eventName,
      blockRange,
      indexFilterValues,
      saiToDAIBridgeContract.ABI(),
    );
    return logs;
  }

  constructor(
    address: string,
    supportedProvider: SupportedProvider,
    txDefaults?: Partial<TxData>,
    logDecodeDependencies?: { [contractName: string]: ContractAbi },
    deployedBytecode: string | undefined = saiToDAIBridgeContract.deployedBytecode,
  ) {
    super('saiToDAIBridge', saiToDAIBridgeContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode);
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
this._subscriptionManager = new SubscriptionManager<saiToDAIBridgeEventArgs, saiToDAIBridgeEvents>(
      saiToDAIBridgeContract.ABI(),
      this._web3Wrapper,
    );
saiToDAIBridgeContract.ABI().forEach((item, index) => {
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
