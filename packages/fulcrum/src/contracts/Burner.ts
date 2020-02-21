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
export class BurnerContract extends BaseContract {
    public admins = {
        async callAsync(
            userAddress: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<boolean> {
            const self = this as any as BurnerContract;
            const encodedData = self._strictEncodeArguments('admins(address)', [
              userAddress
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
            const abiEncoder = self._lookupAbiEncoder('admins(address)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };

    public burn = {
        async callAsync(
            tokenAddress: string,
            amount: BigNumber,
            minUnderlyingPrice: BigNumber,
            maxUnderlyingPrice: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber> {
            const self = this as any as BurnerContract;
            const encodedData = self._strictEncodeArguments('burn(address,uint256,uint256,uint256)', [
                tokenAddress, amount, minUnderlyingPrice, maxUnderlyingPrice
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
            const abiEncoder = self._lookupAbiEncoder('burn(address,uint256,uint256,uint256)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };

    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('Burner', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
