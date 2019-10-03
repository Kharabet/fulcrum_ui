// tslint:disable:no-consecutive-blank-lines ordered-imports align trailing-comma whitespace class-name
// tslint:disable:no-unbound-method
// tslint:disable:variable-name
import { BaseContract } from "@0x/base-contract";
import {
  BlockParam,
  CallData,
  ContractAbi,
  DecodedLogArgs,
  TxData,
  TxDataPayable,
  SupportedProvider
} from "ethereum-types";
import { BigNumber, classUtils } from "@0x/utils";
// tslint:enable:no-unused-variable

/* istanbul ignore next */
// tslint:disable:no-parameter-reassignment
// tslint:disable-next-line:class-name
export class iENSOwnerContract extends BaseContract {
  public setupUser = {
    async sendTransactionAsync(user: string, txData: Partial<TxData> = {}): Promise<string> {
      const self = (this as any) as iENSOwnerContract;
      const encodedData = self._strictEncodeArguments("setupUser(address)", [user]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).setupUser.estimateGasAsync.bind(self, user)
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(user: string, txData: Partial<TxData> = {}): Promise<number> {
      const self = (this as any) as iENSOwnerContract;
      const encodedData = self._strictEncodeArguments("setupUser(address)", [user]);
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
    getABIEncodedTransactionData(user: string): string {
      const self = (this as any) as iENSOwnerContract;
      const abiEncodedTransactionData = self._strictEncodeArguments("setupUser(address)", [user]);
      return abiEncodedTransactionData;
    },
    async callAsync(user: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<void> {
      const self = (this as any) as iENSOwnerContract;
      const encodedData = self._strictEncodeArguments("setupUser(address)", [user]);
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
      const abiEncoder = self._lookupAbiEncoder("setupUser(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  public checkUserSetup = {
    async callAsync(
      user: string,
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam
    ): Promise<string>
    {
      const self = (this as any) as iENSOwnerContract;
      const encodedData = self._strictEncodeArguments("checkUserSetup(address)", [user]);
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
      const abiEncoder = self._lookupAbiEncoder("checkUserSetup(address)");
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    }
  };

  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super("iENSOwnerContract", abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ["_abiEncoderByFunctionSignature", "address", "abi", "_web3Wrapper"]);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
