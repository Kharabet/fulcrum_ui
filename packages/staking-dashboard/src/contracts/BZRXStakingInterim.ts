// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, DecodedLogArgs, TxData, TxDataPayable, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class BZRXStakingInterimContract extends BaseContract {

    public stake = {
        async sendTransactionAsync(
            tokens: string[],
            values: BigNumber[],
            txData: Partial<TxData> = {}
        ): Promise<string> {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("stake(address[],uint256[])", [tokens, values]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).stake.estimateGasAsync.bind(self, tokens, values)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            values: BigNumber[],
            txData: Partial<TxData> = {}
        ): Promise<number> {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("stake(address[],uint256[])", [tokens, values]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults()
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            tokens: string[],
            values: BigNumber[]
            ): string {
            const self = (this as any) as BZRXStakingInterimContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("stake(address[],uint256[])", [tokens, values]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            values: BigNumber[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ) {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("stake(address[],uint256[])", [tokens, values]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults()
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder("stake(address[],uint256[])");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    
    public stakeWithDelegate = {
        async sendTransactionAsync(
            tokens: string[],
            values: BigNumber[],
            address: string,
            txData: Partial<TxData> = {}
        ): Promise<string> {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("stakeWithDelegate(address[],uint256[],string)", [tokens, values, address]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).stakeWithDelegate.estimateGasAsync.bind(self, tokens, values)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            tokens: string[],
            values: BigNumber[],
            address: string,
            txData: Partial<TxData> = {}
        ): Promise<number> {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("stakeWithDelegate(address[],uint256[],string)", [tokens, values, address]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults()
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            tokens: string[],
            values: BigNumber[],
            address: string
            ): string {
            const self = (this as any) as BZRXStakingInterimContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("stakeWithDelegate(address[],uint256[],string)", [tokens, values, address]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            tokens: string[],
            values: BigNumber[],
            address: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ) {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("stakeWithDelegate(address[],uint256[],string)", [tokens, values, address]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults()
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder("stakeWithDelegate(address[],uint256[],string)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    
    public setRepActive = {
        async sendTransactionAsync(
            _isActive: boolean,
            txData: Partial<TxData> = {}
        ): Promise<string> {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("setRepActive(bool)", [_isActive]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).setRepActive.estimateGasAsync.bind(self, _isActive)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            _isActive: boolean,
            txData: Partial<TxData> = {}
        ): Promise<number> {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("setRepActive(bool)", [_isActive]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults()
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            _isActive: boolean,
            ): string {
            const self = (this as any) as BZRXStakingInterimContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("setRepActive(bool)", [_isActive]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _isActive: boolean,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ) {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("setRepActive(bool)", [_isActive]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults()
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder("setRepActive(bool)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    
    public stakeableByAsset = {
        async callAsync(
            token: string,
            account: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("stakeableByAsset(address,address)", [token,account]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults()
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder("stakeableByAsset(address,address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    
    public balanceOfByAsset = {
        async callAsync(
            token: string,
            account: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("balanceOfByAsset(address,address)", [token,account]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults()
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder("balanceOfByAsset(address,address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    
    public getRepVotes = {
        async callAsync(
            start: BigNumber,
            count: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<Array<{
            wallet: string;
            isActive: boolean;
            BZRX: BigNumber;
            vBZRX: BigNumber;
            LPToken: BigNumber;
          }>> {
            const self = (this as any) as BZRXStakingInterimContract;
            const encodedData = self._strictEncodeArguments("getRepVotes(uint256,uint256)", [start,count]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults()
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder("getRepVotes(uint256,uint256)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<Array<{
                wallet: string;
                isActive: boolean;
                BZRX: BigNumber;
                vBZRX: BigNumber;
                LPToken: BigNumber;
              }>>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('BZRXStakingInterim', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
