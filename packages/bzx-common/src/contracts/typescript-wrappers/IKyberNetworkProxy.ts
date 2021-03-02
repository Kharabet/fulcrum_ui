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


export type IKyberNetworkProxyEventArgs =
  | IKyberNetworkProxyExecuteTradeEventArgs;

export enum IKyberNetworkProxyEvents {
  ExecuteTrade = 'ExecuteTrade',
}

export interface IKyberNetworkProxyExecuteTradeEventArgs extends DecodedLogArgs {
  trader: string;
  src: string;
  dest: string;
  destAddress: string;
  actualSrcAmount: BigNumber;
  actualDestAmount: BigNumber;
  platformWallet: string;
  platformFeeBps: BigNumber;
}


/* istanbul ignore next */
// tslint:disable:array-type
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class IKyberNetworkProxyContract extends BaseContract {
  /**
    * @ignore
    */
public static deployedBytecode: string | undefined;
public static contractName = 'IKyberNetworkProxy';
  private readonly _methodABIIndex: { [name: string]: number } = {};
private readonly _subscriptionManager: SubscriptionManager<IKyberNetworkProxyEventArgs, IKyberNetworkProxyEvents>;
public static async deployFrom0xArtifactAsync(
    artifact: ContractArtifact | SimpleContractArtifact,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
  ): Promise<IKyberNetworkProxyContract> {
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
    return IKyberNetworkProxyContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
  }

  public static async deployWithLibrariesFrom0xArtifactAsync(
    artifact: ContractArtifact,
    libraryArtifacts: { [libraryName: string]: ContractArtifact },
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: (ContractArtifact | SimpleContractArtifact) },
  ): Promise<IKyberNetworkProxyContract> {
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
    const libraryAddresses = await IKyberNetworkProxyContract._deployLibrariesAsync(
      artifact,
      libraryArtifacts,
      new Web3Wrapper(provider),
      txDefaults
    );
    const bytecode = linkLibrariesInBytecode(
      artifact,
      libraryAddresses,
    );
    return IKyberNetworkProxyContract.deployAsync(bytecode, abi, provider, txDefaults, logDecodeDependenciesAbiOnly, );
  }

  public static async deployAsync(
    bytecode: string,
    abi: ContractAbi,
    supportedProvider: SupportedProvider,
    txDefaults: Partial<TxData>,
    logDecodeDependencies: { [contractName: string]: ContractAbi },
  ): Promise<IKyberNetworkProxyContract> {
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
    logUtils.log(`IKyberNetworkProxy successfully deployed at ${txReceipt.contractAddress}`);
    const contractInstance = new IKyberNetworkProxyContract(txReceipt.contractAddress as string, provider, txDefaults, logDecodeDependencies);
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
            name: 'trader',
            type: 'address',
            indexed: true,
          },
          {
            name: 'src',
            type: 'address',
            indexed: false,
          },
          {
            name: 'dest',
            type: 'address',
            indexed: false,
          },
          {
            name: 'destAddress',
            type: 'address',
            indexed: false,
          },
          {
            name: 'actualSrcAmount',
            type: 'uint256',
            indexed: false,
          },
          {
            name: 'actualDestAmount',
            type: 'uint256',
            indexed: false,
          },
          {
            name: 'platformWallet',
            type: 'address',
            indexed: false,
          },
          {
            name: 'platformFeeBps',
            type: 'uint256',
            indexed: false,
          },
        ],
        name: 'ExecuteTrade',
        outputs: [
        ],
        type: 'event',
      },
      { 
        inputs: [
          {
            name: 'src',
            type: 'address',
          },
          {
            name: 'dest',
            type: 'address',
          },
          {
            name: 'srcQty',
            type: 'uint256',
          },
        ],
        name: 'getExpectedRate',
        outputs: [
          {
            name: 'expectedRate',
            type: 'uint256',
          },
          {
            name: 'worstRate',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      { 
        inputs: [
          {
            name: 'src',
            type: 'address',
          },
          {
            name: 'dest',
            type: 'address',
          },
          {
            name: 'srcQty',
            type: 'uint256',
          },
          {
            name: 'platformFeeBps',
            type: 'uint256',
          },
          {
            name: 'hint',
            type: 'bytes',
          },
        ],
        name: 'getExpectedRateAfterFee',
        outputs: [
          {
            name: 'expectedRate',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
      { 
        inputs: [
          {
            name: 'src',
            type: 'address',
          },
          {
            name: 'srcAmount',
            type: 'uint256',
          },
          {
            name: 'dest',
            type: 'address',
          },
          {
            name: 'destAddress',
            type: 'address',
          },
          {
            name: 'maxDestAmount',
            type: 'uint256',
          },
          {
            name: 'minConversionRate',
            type: 'uint256',
          },
          {
            name: 'platformWallet',
            type: 'address',
          },
        ],
        name: 'trade',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'payable',
        type: 'function',
      },
      { 
        inputs: [
          {
            name: 'src',
            type: 'address',
          },
          {
            name: 'srcAmount',
            type: 'uint256',
          },
          {
            name: 'dest',
            type: 'address',
          },
          {
            name: 'destAddress',
            type: 'address',
          },
          {
            name: 'maxDestAmount',
            type: 'uint256',
          },
          {
            name: 'minConversionRate',
            type: 'uint256',
          },
          {
            name: 'walletId',
            type: 'address',
          },
          {
            name: 'hint',
            type: 'bytes',
          },
        ],
        name: 'tradeWithHint',
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'payable',
        type: 'function',
      },
      { 
        inputs: [
          {
            name: 'src',
            type: 'address',
          },
          {
            name: 'srcAmount',
            type: 'uint256',
          },
          {
            name: 'dest',
            type: 'address',
          },
          {
            name: 'destAddress',
            type: 'address',
          },
          {
            name: 'maxDestAmount',
            type: 'uint256',
          },
          {
            name: 'minConversionRate',
            type: 'uint256',
          },
          {
            name: 'platformWallet',
            type: 'address',
          },
          {
            name: 'platformFeeBps',
            type: 'uint256',
          },
          {
            name: 'hint',
            type: 'bytes',
          },
        ],
        name: 'tradeWithHintAndFee',
        outputs: [
          {
            name: 'destAmount',
            type: 'uint256',
          },
        ],
        stateMutability: 'payable',
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
          await IKyberNetworkProxyContract._deployLibrariesAsync(
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
    const methodAbi = IKyberNetworkProxyContract.ABI()[index] as MethodAbi; // tslint:disable-line:no-unnecessary-type-assertion
    const functionSignature = methodAbiToFunctionSignature(methodAbi);
    return functionSignature;
  }

  public getABIDecodedTransactionData<T>(methodName: string, callData: string): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as IKyberNetworkProxyContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecode<T>(callData);
    return abiDecodedCallData;
  }

  public getABIDecodedReturnData<T>(methodName: string, callData: string): T {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as IKyberNetworkProxyContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    const abiDecodedCallData = abiEncoder.strictDecodeReturnValue<T>(callData);
    return abiDecodedCallData;
  }

  public getSelector(methodName: string): string {
    const functionSignature = this.getFunctionSignature(methodName);
    const self = (this as any) as IKyberNetworkProxyContract;
    const abiEncoder = self._lookupAbiEncoder(functionSignature);
    return abiEncoder.getSelector();
  }

  public getExpectedRate(
        src: string,
        dest: string,
        srcQty: BigNumber,
  ): ContractTxFunctionObj<[BigNumber, BigNumber]
> {
    const self = this as any as IKyberNetworkProxyContract;
      assert.isString('src', src);
      assert.isString('dest', dest);
      assert.isBigNumber('srcQty', srcQty);
    const functionSignature = 'getExpectedRate(address,address,uint256)';

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
      ): Promise<[BigNumber, BigNumber]
      > {
        BaseContract._assertCallParams(callData, defaultBlock);
        const rawCallResult = await self._performCallAsync({ data: this.getABIEncodedTransactionData(), ...callData }, defaultBlock);
        const abiEncoder = self._lookupAbiEncoder(functionSignature);
        BaseContract._throwIfUnexpectedEmptyCallResult(rawCallResult, abiEncoder);
        return abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
      >(rawCallResult);
      },
      getABIEncodedTransactionData(): string {
        return self._strictEncodeArguments(functionSignature, [src.toLowerCase(),
      dest.toLowerCase(),
      srcQty
      ]);
      },
    }
  };
  public getExpectedRateAfterFee(
        src: string,
        dest: string,
        srcQty: BigNumber,
        platformFeeBps: BigNumber,
        hint: string,
  ): ContractTxFunctionObj<BigNumber
> {
    const self = this as any as IKyberNetworkProxyContract;
      assert.isString('src', src);
      assert.isString('dest', dest);
      assert.isBigNumber('srcQty', srcQty);
      assert.isBigNumber('platformFeeBps', platformFeeBps);
      assert.isString('hint', hint);
    const functionSignature = 'getExpectedRateAfterFee(address,address,uint256,uint256,bytes)';

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
        return self._strictEncodeArguments(functionSignature, [src.toLowerCase(),
      dest.toLowerCase(),
      srcQty,
      platformFeeBps,
      hint
      ]);
      },
    }
  };
  public trade(
        src: string,
        srcAmount: BigNumber,
        dest: string,
        destAddress: string,
        maxDestAmount: BigNumber,
        minConversionRate: BigNumber,
        platformWallet: string,
  ): ContractTxFunctionObj<BigNumber
> {
    const self = this as any as IKyberNetworkProxyContract;
      assert.isString('src', src);
      assert.isBigNumber('srcAmount', srcAmount);
      assert.isString('dest', dest);
      assert.isString('destAddress', destAddress);
      assert.isBigNumber('maxDestAmount', maxDestAmount);
      assert.isBigNumber('minConversionRate', minConversionRate);
      assert.isString('platformWallet', platformWallet);
    const functionSignature = 'trade(address,uint256,address,address,uint256,uint256,address)';

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
        return self._strictEncodeArguments(functionSignature, [src.toLowerCase(),
      srcAmount,
      dest.toLowerCase(),
      destAddress.toLowerCase(),
      maxDestAmount,
      minConversionRate,
      platformWallet.toLowerCase()
      ]);
      },
    }
  };
  public tradeWithHint(
        src: string,
        srcAmount: BigNumber,
        dest: string,
        destAddress: string,
        maxDestAmount: BigNumber,
        minConversionRate: BigNumber,
        walletId: string,
        hint: string,
  ): ContractTxFunctionObj<BigNumber
> {
    const self = this as any as IKyberNetworkProxyContract;
      assert.isString('src', src);
      assert.isBigNumber('srcAmount', srcAmount);
      assert.isString('dest', dest);
      assert.isString('destAddress', destAddress);
      assert.isBigNumber('maxDestAmount', maxDestAmount);
      assert.isBigNumber('minConversionRate', minConversionRate);
      assert.isString('walletId', walletId);
      assert.isString('hint', hint);
    const functionSignature = 'tradeWithHint(address,uint256,address,address,uint256,uint256,address,bytes)';

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
        return self._strictEncodeArguments(functionSignature, [src.toLowerCase(),
      srcAmount,
      dest.toLowerCase(),
      destAddress.toLowerCase(),
      maxDestAmount,
      minConversionRate,
      walletId.toLowerCase(),
      hint
      ]);
      },
    }
  };
  public tradeWithHintAndFee(
        src: string,
        srcAmount: BigNumber,
        dest: string,
        destAddress: string,
        maxDestAmount: BigNumber,
        minConversionRate: BigNumber,
        platformWallet: string,
        platformFeeBps: BigNumber,
        hint: string,
  ): ContractTxFunctionObj<BigNumber
> {
    const self = this as any as IKyberNetworkProxyContract;
      assert.isString('src', src);
      assert.isBigNumber('srcAmount', srcAmount);
      assert.isString('dest', dest);
      assert.isString('destAddress', destAddress);
      assert.isBigNumber('maxDestAmount', maxDestAmount);
      assert.isBigNumber('minConversionRate', minConversionRate);
      assert.isString('platformWallet', platformWallet);
      assert.isBigNumber('platformFeeBps', platformFeeBps);
      assert.isString('hint', hint);
    const functionSignature = 'tradeWithHintAndFee(address,uint256,address,address,uint256,uint256,address,uint256,bytes)';

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
        return self._strictEncodeArguments(functionSignature, [src.toLowerCase(),
      srcAmount,
      dest.toLowerCase(),
      destAddress.toLowerCase(),
      maxDestAmount,
      minConversionRate,
      platformWallet.toLowerCase(),
      platformFeeBps,
      hint
      ]);
      },
    }
  };

  /**
    * Subscribe to an event type emitted by the IKyberNetworkProxy contract.
    * @param eventName The IKyberNetworkProxy contract event you would like to subscribe to.
    * @param indexFilterValues An object where the keys are indexed args returned by the event and
    * the value is the value you are interested in. E.g `{maker: aUserAddressHex}`
    * @param callback Callback that gets called when a log is added/removed
    * @param isVerbose Enable verbose subscription warnings (e.g recoverable network issues encountered)
    * @return Subscription token used later to unsubscribe
    */
  public subscribe<ArgsType extends IKyberNetworkProxyEventArgs>(
    eventName: IKyberNetworkProxyEvents,
    indexFilterValues: IndexedFilterValues,
    callback: EventCallback<ArgsType>,
    isVerbose: boolean = false,
    blockPollingIntervalMs?: number,
  ): string {
    assert.doesBelongToStringEnum('eventName', eventName, IKyberNetworkProxyEvents);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    assert.isFunction('callback', callback);
    const subscriptionToken = this._subscriptionManager.subscribe<ArgsType>(
      this.address,
      eventName,
      indexFilterValues,
      IKyberNetworkProxyContract.ABI(),
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
    * @param eventName The IKyberNetworkProxy contract event you would like to subscribe to.
    * @param blockRange Block range to get logs from.
    * @param indexFilterValues An object where the keys are indexed args returned by the event and
    * the value is the value you are interested in. E.g `{_from: aUserAddressHex}`
    * @return Array of logs that match the parameters
    */
  public async getLogsAsync<ArgsType extends IKyberNetworkProxyEventArgs>(
    eventName: IKyberNetworkProxyEvents,
    blockRange: BlockRange,
    indexFilterValues: IndexedFilterValues,
  ): Promise<Array<LogWithDecodedArgs<ArgsType>>> {
    assert.doesBelongToStringEnum('eventName', eventName, IKyberNetworkProxyEvents);
    assert.doesConformToSchema('blockRange', blockRange, schemas.blockRangeSchema);
    assert.doesConformToSchema('indexFilterValues', indexFilterValues, schemas.indexFilterValuesSchema);
    const logs = await this._subscriptionManager.getLogsAsync<ArgsType>(
      this.address,
      eventName,
      blockRange,
      indexFilterValues,
      IKyberNetworkProxyContract.ABI(),
    );
    return logs;
  }

  constructor(
    address: string,
    supportedProvider: SupportedProvider,
    txDefaults?: Partial<TxData>,
    logDecodeDependencies?: { [contractName: string]: ContractAbi },
    deployedBytecode: string | undefined = IKyberNetworkProxyContract.deployedBytecode,
  ) {
    super('IKyberNetworkProxy', IKyberNetworkProxyContract.ABI(), address, supportedProvider, txDefaults, logDecodeDependencies, deployedBytecode);
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', '_web3Wrapper']);
this._subscriptionManager = new SubscriptionManager<IKyberNetworkProxyEventArgs, IKyberNetworkProxyEvents>(
      IKyberNetworkProxyContract.ABI(),
      this._web3Wrapper,
    );
IKyberNetworkProxyContract.ABI().forEach((item, index) => {
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
