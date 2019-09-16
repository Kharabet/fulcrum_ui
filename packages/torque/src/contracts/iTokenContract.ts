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
export class iTokenContract extends BaseContract {

    public getDepositAmountForBorrow = {
        async callAsync(
            borrowAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenAddress: string,
            useFixedInterestModel: boolean,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('getDepositAmountForBorrow(uint256,uint256,uint256,address,bool)', [
                borrowAmount,
                leverageAmount,
                initialLoanDuration,
                collateralTokenAddress,
                useFixedInterestModel
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
            const abiEncoder = self._lookupAbiEncoder('getDepositAmountForBorrow(uint256,uint256,uint256,address,bool)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };

    public getBorrowAmountForDeposit = {
        async callAsync(
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenAddress: string,
            useFixedInterestModel: boolean,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam,
        ): Promise<BigNumber
        > {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments('getBorrowAmountForDeposit(uint256,uint256,uint256,address,bool)', [
                depositAmount,
                leverageAmount,
                initialLoanDuration,
                collateralTokenAddress,
                useFixedInterestModel
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
            const abiEncoder = self._lookupAbiEncoder('getBorrowAmountForDeposit(uint256,uint256,uint256,address,bool)');
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber
        >(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        },
    };

    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super('iToken', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
