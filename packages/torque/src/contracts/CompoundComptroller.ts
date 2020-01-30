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
export class CompoundComptrollerContract extends BaseContract {
  public getAssetsIn = {
    async callAsync(
      account: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<string[]
      > {
      const self = this as any as CompoundComptrollerContract;
      const encodedData = self._strictEncodeArguments('getAssetsIn(address)', [account
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
      const abiEncoder = self._lookupAbiEncoder('getAssetsIn(address)');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string[]
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super('CompoundComptroller', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
