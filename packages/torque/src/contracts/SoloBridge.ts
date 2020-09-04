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
export class SoloBridgeContract extends BaseContract {
  public migrateLoan = {
    async sendTransactionAsync(
      account: {owner: string;number: BigNumber},
      marketId: BigNumber,
      loanAmount: BigNumber,
      marketIds: BigNumber[],
      amounts: BigNumber[],
      collateralAmounts: BigNumber[],
      borrowAmounts: BigNumber[],
      txData: Partial<TxData> = {},
    ): Promise<string> {
      const self = this as any as SoloBridgeContract;
      const encodedData = self._strictEncodeArguments('migrateLoan((address,uint256),uint256,uint256,uint256[],uint256[],uint256[],uint256[])', [account,
        marketId,
        loanAmount,
        marketIds,
        amounts,
        collateralAmounts,
        borrowAmounts
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData,
        },
        self._web3Wrapper.getContractDefaults(),
        (self as any).migrateLoan.estimateGasAsync.bind(
          self,
          account,
          marketId,
          loanAmount,
          marketIds,
          amounts,
          collateralAmounts,
          borrowAmounts
        ),
      );
      const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
      return txHash;
    },
    async estimateGasAsync(
      account: {owner: string;number: BigNumber},
      marketId: BigNumber,
      loanAmount: BigNumber,
      marketIds: BigNumber[],
      amounts: BigNumber[],
      collateralAmounts: BigNumber[],
      borrowAmounts: BigNumber[],
      txData: Partial<TxData> = {},
    ): Promise<number> {
      const self = this as any as SoloBridgeContract;
      const encodedData = self._strictEncodeArguments('migrateLoan((address,uint256),uint256,uint256,uint256[],uint256[],uint256[],uint256[])', [account,
        marketId,
        loanAmount,
        marketIds,
        amounts,
        collateralAmounts,
        borrowAmounts
      ]);
      const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
        {
          to: self.address,
          ...txData,
          data: encodedData,
        },
        self._web3Wrapper.getContractDefaults(),
      );
      const gas = (await self._web3Wrapper.estimateGasAsync(txDataWithDefaults)) * 1.2;
      return gas > 10000000 ? 10000000 : Math.floor(gas);
    },
    getABIEncodedTransactionData(
      account: {owner: string;number: BigNumber},
      marketId: BigNumber,
      loanAmount: BigNumber,
      marketIds: BigNumber[],
      amounts: BigNumber[],
      collateralAmounts: BigNumber[],
      borrowAmounts: BigNumber[],
    ): string {
      const self = this as any as SoloBridgeContract;
      const abiEncodedTransactionData = self._strictEncodeArguments('migrateLoan((address,uint256),uint256,uint256,uint256[],uint256[],uint256[],uint256[])', [account,
        marketId,
        loanAmount,
        marketIds,
        amounts,
        collateralAmounts,
        borrowAmounts
      ]);
      return abiEncodedTransactionData;
    },
    async callAsync(
      account: {owner: string;number: BigNumber},
      marketId: BigNumber,
      loanAmount: BigNumber,
      marketIds: BigNumber[],
      amounts: BigNumber[],
      collateralAmounts: BigNumber[],
      borrowAmounts: BigNumber[],
      callData: Partial<CallData> = {},
      defaultBlock?: BlockParam,
    ): Promise<void
      > {
      const self = this as any as SoloBridgeContract;
      const encodedData = self._strictEncodeArguments('migrateLoan((address,uint256),uint256,uint256,uint256[],uint256[],uint256[],uint256[])', [account,
        marketId,
        loanAmount,
        marketIds,
        amounts,
        collateralAmounts,
        borrowAmounts
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
      const abiEncoder = self._lookupAbiEncoder('migrateLoan((address,uint256),uint256,uint256,uint256[],uint256[],uint256[],uint256[])');
      // tslint:disable boolean-naming
      const result = abiEncoder.strictDecodeReturnValue<void
        >(rawCallResult);
      // tslint:enable boolean-naming
      return result;
    },
  };
  constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
    super('SoloBridge', abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
    classUtils.bindAll(this, ['_abiEncoderByFunctionSignature', 'address', 'abi', '_web3Wrapper']);
  }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
