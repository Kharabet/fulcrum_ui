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
export class oracleContract extends BaseContract {
    public getTradeData = {
        async callAsync(
            src: string,
            dest: string,
            srcQty: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber, BigNumber]
        > {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as oracleContract;
            const encodedData = self._strictEncodeArguments('getTradeData(address,address,uint256)', [src,
        dest,
        srcQty
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
            const abiEncoder = self._lookupAbiEncoder('getTradeData(address,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };

    // for test networks not using not using BZxOraclePriceFeed
    public getExpectedRate = {
        async callAsync(
            src: string,
            dest: string,
            srcQty: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber, BigNumber]
        > {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as oracleContract;
            const encodedData = self._strictEncodeArguments('getExpectedRate(address,address,uint256)', [src,
        dest,
        srcQty
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
            const abiEncoder = self._lookupAbiEncoder('getExpectedRate(address,address,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber, BigNumber]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };

    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('oracle', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
