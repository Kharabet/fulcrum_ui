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
export class marketMakerProvisionContract extends BaseContract {
    public mint = {
        async sendTransactionAsync(
            symbol: string,
            maxPriceAllowed: BigNumber,
            forTime: BigNumber,
            txData: Partial<TxDataPayable> = {},
        ): Promise<string> {
            const self = this as any as marketMakerProvisionContract;
            const encodedData = self._strictEncodeArguments('mint(string,uint256,uint256)', [symbol,
    maxPriceAllowed,
    forTime
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).mint.estimateGasAsync.bind(
                    self,
                    symbol,
                    maxPriceAllowed,
                    forTime
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            symbol: string,
            maxPriceAllowed: BigNumber,
            forTime: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as marketMakerProvisionContract;
            const encodedData = self._strictEncodeArguments('mint(string,uint256,uint256)', [symbol,
    maxPriceAllowed,
    forTime
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            symbol: string,
            maxPriceAllowed: BigNumber,
            forTime: BigNumber,
        ): string {
            const self = this as any as marketMakerProvisionContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('mint(string,uint256,uint256)', [symbol,
    maxPriceAllowed,
    forTime
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            symbol: string,
            maxPriceAllowed: BigNumber,
            forTime: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as marketMakerProvisionContract;
            const encodedData = self._strictEncodeArguments('mint(string,uint256,uint256)', [symbol,
        maxPriceAllowed,
        forTime
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('mint(string,uint256,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    public burn = {
        async sendTransactionAsync(
            symbol: string,
            value: BigNumber,
            minPriceAllowed: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<string> {
            const self = this as any as marketMakerProvisionContract;
            const encodedData = self._strictEncodeArguments('burn(string,uint256,uint256)', [symbol,
    value,
    minPriceAllowed
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).burn.estimateGasAsync.bind(
                    self,
                    symbol,
                    value,
                    minPriceAllowed
                ),
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            symbol: string,
            value: BigNumber,
            minPriceAllowed: BigNumber,
            txData: Partial<TxData> = {},
        ): Promise<number> {
            const self = this as any as marketMakerProvisionContract;
            const encodedData = self._strictEncodeArguments('burn(string,uint256,uint256)', [symbol,
    value,
    minPriceAllowed
    ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const gas = await self._web3Wrapper.estimateGasAsync(txDataWithDefaults);
            return gas;
        },
        getABIEncodedTransactionData(
            symbol: string,
            value: BigNumber,
            minPriceAllowed: BigNumber,
        ): string {
            const self = this as any as marketMakerProvisionContract;
            const abiEncodedTransactionData = self._strictEncodeArguments('burn(string,uint256,uint256)', [symbol,
    value,
    minPriceAllowed
    ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            symbol: string,
            value: BigNumber,
            minPriceAllowed: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<void
        > {
            const self = this as any as marketMakerProvisionContract;
            const encodedData = self._strictEncodeArguments('burn(string,uint256,uint256)', [symbol,
        value,
        minPriceAllowed
        ]);
            const callDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...callData,
                    data: encodedData,
                },
                self._web3Wrapper.getContractDefaults(),
            );
            const rawCallResult = await self._web3Wrapper.callAsync(callDataWithDefaults, defaultBlock);
            BaseContract._throwIfRevertWithReasonCallResult(rawCallResult);
            const abiEncoder = self._lookupAbiEncoder('burn(string,uint256,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };
    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('marketMakerProvision', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
