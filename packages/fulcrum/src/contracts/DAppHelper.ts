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
export class DAppHelperContract extends BaseContract {
    public assetRates = {
        async callAsync(
            oracleAddress: string,
            usdTokenAddress: string,
            tokens: string[],
            amounts: BigNumber[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber[]
        > {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as DAppHelperContract;
            const encodedData = self._strictEncodeArguments('assetRates(address,address,address[],uint256[])', [
                oracleAddress,
                usdTokenAddress,
                tokens,
                amounts
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
            const abiEncoder = self._lookupAbiEncoder('assetRates(address,address,address[],uint256[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber[]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };

    public reserveDetails = {
        async callAsync(
            tokenAddresses: string[],
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<[BigNumber[], BigNumber[], BigNumber[], BigNumber[], BigNumber[], BigNumber[]]
        > {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as DAppHelperContract;
            const encodedData = self._strictEncodeArguments('reserveDetails(address[])', [
                tokenAddresses
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
            const abiEncoder = self._lookupAbiEncoder('reserveDetails(address[])');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[BigNumber[], BigNumber[], BigNumber[], BigNumber[], BigNumber[], BigNumber[]]
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };

    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('DAppHelper', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
