// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import { BlockParam, CallData, ContractAbi, TxData, SupportedProvider } from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable


/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class traderCompensationContract extends BaseContract {

    public canOptin = {
        async callAsync(
            user: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<boolean> {
            const self = (this as any) as traderCompensationContract;
            const encodedData = self._strictEncodeArguments("canOptin(address)", [user]);
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
            const abiEncoder = self._lookupAbiEncoder("canOptin(address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    
    public claimable = {
        async callAsync(
            user: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as traderCompensationContract;
            const encodedData = self._strictEncodeArguments("claimable(address)", [user]);
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
            const abiEncoder = self._lookupAbiEncoder("claimable(address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public claim = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        )  {
            const self = (this as any) as traderCompensationContract;
            const encodedData = self._strictEncodeArguments("claim()", []);
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
            const abiEncoder = self._lookupAbiEncoder("claim()");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
            const self = (this as any) as traderCompensationContract;
            const encodedData = self._strictEncodeArguments("claim()", []);
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
        getABIEncodedTransactionData(): string {
            const self = (this as any) as traderCompensationContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("claim()", []);
            return abiEncodedTransactionData;
        },

        async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
            const self = (this as any) as traderCompensationContract;
            const encodedData = self._strictEncodeArguments("claim()", []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).claim.estimateGasAsync.bind(self)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
    };
    
    public optin = {
        async callAsync(
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ){
            const self = (this as any) as traderCompensationContract;
            const encodedData = self._strictEncodeArguments("optin()", []);
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
            const abiEncoder = self._lookupAbiEncoder("optin()");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
        async estimateGasAsync(txData: Partial<TxData> = {}): Promise<number> {
            const self = (this as any) as traderCompensationContract;
            const encodedData = self._strictEncodeArguments("optin()", []);
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
        getABIEncodedTransactionData(): string {
            const self = (this as any) as traderCompensationContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("optin()", []);
            return abiEncodedTransactionData;
        },

        async sendTransactionAsync(txData: Partial<TxData> = {}): Promise<string> {
            const self = (this as any) as traderCompensationContract;
            const encodedData = self._strictEncodeArguments("optin()", []);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).optin.estimateGasAsync.bind(self)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
    };

    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('traderCompensation', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
