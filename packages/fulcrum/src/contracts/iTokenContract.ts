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
export class iTokenContract extends BaseContract {

    public mint = {
        async sendTransactionAsync(
            receiver: string,
            depositAmount: BigNumber,
            txData: Partial<TxData> = {}
        ): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("mint(address,uint256)", [receiver, depositAmount]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).mint.estimateGasAsync.bind(self, receiver, depositAmount)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(receiver: string, depositAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("mint(address,uint256)", [receiver, depositAmount]);
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
        getABIEncodedTransactionData(receiver: string, depositAmount: BigNumber): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("mint(address,uint256)", [receiver, depositAmount]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            receiver: string,
            depositAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("mint(address,uint256)", [receiver, depositAmount]);
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
            const abiEncoder = self._lookupAbiEncoder("mint(address,uint256)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public mintWithEther = {
        async sendTransactionAsync(receiver: string, txData: Partial<TxDataPayable> = {}): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("mintWithEther(address)", [receiver]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).mintWithEther.estimateGasAsync.bind(self, receiver)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(receiver: string, txData: Partial<TxData> = {}): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("mintWithEther(address)", [receiver]);
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
        getABIEncodedTransactionData(receiver: string): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("mintWithEther(address)", [receiver]);
            return abiEncodedTransactionData;
        },
        async callAsync(receiver: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("mintWithEther(address)", [receiver]);
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
            const abiEncoder = self._lookupAbiEncoder("mintWithEther(address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public mintWithChai = {
        async sendTransactionAsync(
            receiver: string,
            depositAmount: BigNumber,
            txData: Partial<TxData> = {}
        ): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("mintWithChai(address,uint256)", [receiver, depositAmount]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).mintWithChai.estimateGasAsync.bind(self, receiver, depositAmount)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(receiver: string, depositAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("mintWithChai(address,uint256)", [receiver, depositAmount]);
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
        getABIEncodedTransactionData(receiver: string, depositAmount: BigNumber): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("mintWithChai(address,uint256)", [receiver, depositAmount]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            receiver: string,
            depositAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("mintWithChai(address,uint256)", [receiver, depositAmount]);
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
            const abiEncoder = self._lookupAbiEncoder("mintWithChai(address,uint256)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public burn = {
        async sendTransactionAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("burn(address,uint256)", [receiver, burnAmount]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).burn.estimateGasAsync.bind(self, receiver, burnAmount)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("burn(address,uint256)", [receiver, burnAmount]);
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
        getABIEncodedTransactionData(receiver: string, burnAmount: BigNumber): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("burn(address,uint256)", [receiver, burnAmount]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            receiver: string,
            burnAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("burn(address,uint256)", [receiver, burnAmount]);
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
            const abiEncoder = self._lookupAbiEncoder("burn(address,uint256)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public burnToEther = {
        async sendTransactionAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("burnToEther(address,uint256)", [receiver, burnAmount]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).burnToEther.estimateGasAsync.bind(self, receiver, burnAmount)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("burnToEther(address,uint256)", [receiver, burnAmount]);
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
        getABIEncodedTransactionData(receiver: string, burnAmount: BigNumber): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("burnToEther(address,uint256)", [
                receiver,
                burnAmount
            ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            receiver: string,
            burnAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("burnToEther(address,uint256)", [receiver, burnAmount]);
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
            const abiEncoder = self._lookupAbiEncoder("burnToEther(address,uint256)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public burnToChai = {
        async sendTransactionAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("burnToChai(address,uint256)", [receiver, burnAmount]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).burnToChai.estimateGasAsync.bind(self, receiver, burnAmount)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(receiver: string, burnAmount: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("burnToChai(address,uint256)", [receiver, burnAmount]);
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
        getABIEncodedTransactionData(receiver: string, burnAmount: BigNumber): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("burnToChai(address,uint256)", [receiver, burnAmount]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            receiver: string,
            burnAmount: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("burnToChai(address,uint256)", [receiver, burnAmount]);
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
            const abiEncoder = self._lookupAbiEncoder("burnToChai(address,uint256)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public supplyInterestRate = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("supplyInterestRate()", []);
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
            const abiEncoder = self._lookupAbiEncoder("supplyInterestRate()");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public avgBorrowInterestRate = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("avgBorrowInterestRate()", []);
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
            const abiEncoder = self._lookupAbiEncoder("avgBorrowInterestRate()");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public borrowInterestRate = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("borrowInterestRate()", []);
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
            const abiEncoder = self._lookupAbiEncoder("borrowInterestRate()");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public symbol = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("symbol()", []);
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
            const abiEncoder = self._lookupAbiEncoder("symbol()");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public tokenPrice = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("tokenPrice()", []);
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
            const abiEncoder = self._lookupAbiEncoder("tokenPrice()");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public chaiPrice = { // only available on iDAI
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("chaiPrice()", []);
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
            const abiEncoder = self._lookupAbiEncoder("chaiPrice()");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    /*bytes32 loanId, // 0 if new loan
    uint256 depositAmount,
    uint256 leverageAmount,
    uint256 loanTokenSent,
    uint256 collateralTokenSent,
    uint256 tradeTokenSent,
    address trader,
    address depositTokenAddress,
    address collateralTokenAddress,
    bytes memory loanDataBytes)*/

    public marginTradeFromDeposit = {
        async sendTransactionAsync(
            loanId: string,
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            trader: string,
            depositToken: string,
            collateralToken: string,
            loanData: string,
            txData: Partial<TxData> = {}
        ): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("marginTradeFromDeposit(bytes32,uint256,uint256,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                depositAmount,
                leverageAmount,
                loanTokenSent,
                collateralTokenSent,
                tradeTokenSent,
                trader,
                depositToken,
                collateralToken,
                loanData
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).marginTradeFromDeposit.estimateGasAsync.bind(
                    self,
                    loanId,
                    depositAmount,
                    leverageAmount,
                    loanTokenSent,
                    collateralTokenSent,
                    tradeTokenSent,
                    trader,
                    depositToken,
                    collateralToken,
                    loanData
                )
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            loanId: string,
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            trader: string,
            depositToken: string,
            collateralToken: string,
            loanData: string,
            txData: Partial<TxData> = {}
        ): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("marginTradeFromDeposit(bytes32,uint256,uint256,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                depositAmount,
                leverageAmount,
                loanTokenSent,
                collateralTokenSent,
                tradeTokenSent,
                trader,
                depositToken,
                collateralToken,
                loanData
            ]);
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
            loanId: string,
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            trader: string,
            depositToken: string,
            collateralToken: string,
            loanData: string,
        ): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("marginTradeFromDeposit(bytes32,uint256,uint256,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                depositAmount,
                leverageAmount,
                loanTokenSent,
                collateralTokenSent,
                tradeTokenSent,
                trader,
                depositToken,
                collateralToken,
                loanData
            ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            loanId: string,
            depositAmount: BigNumber,
            leverageAmount: BigNumber,
            loanTokenSent: BigNumber,
            collateralTokenSent: BigNumber,
            tradeTokenSent: BigNumber,
            trader: string,
            depositToken: string,
            collateralToken: string,
            loanData: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("marginTradeFromDeposit(bytes32,uint256,uint256,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                depositAmount,
                leverageAmount,
                loanTokenSent,
                collateralTokenSent,
                tradeTokenSent,
                trader,
                depositToken,
                collateralToken,
                loanData
            ]);
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
            const abiEncoder = self._lookupAbiEncoder("marginTradeFromDeposit(bytes32,uint256,uint256,uint256,uint256,uint256,address,address,address,bytes)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public borrowTokenFromDeposit = {
        async sendTransactionAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            receiver: string,
            collateralToken: string,
            loanData: string,
            txData: Partial<TxData> = {}
        ): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                withdrawAmount,
                initialLoanDuration,
                collateralTokenSent,
                borrower,
                receiver,
                collateralToken,
                loanData
            ]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).borrowTokenFromDeposit.estimateGasAsync.bind(
                    self,
                    loanId,
                    withdrawAmount,
                    initialLoanDuration,
                    collateralTokenSent,
                    borrower,
                    receiver,
                    collateralToken,
                    loanData
                )
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            receiver: string,
            collateralToken: string,
            loanData: string,
            txData: Partial<TxData> = {}
        ): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                withdrawAmount,
                initialLoanDuration,
                collateralTokenSent,
                borrower,
                receiver,
                collateralToken,
                loanData
            ]);
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
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            receiver: string,
            collateralToken: string,
            loanData: string,
        ): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                withdrawAmount,
                initialLoanDuration,
                collateralTokenSent,
                borrower,
                receiver,
                collateralToken,
                loanData
            ]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            loanId: string,
            withdrawAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralTokenSent: BigNumber,
            borrower: string,
            receiver: string,
            collateralToken: string,
            loanData: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)", [
                loanId,
                withdrawAmount,
                initialLoanDuration,
                collateralTokenSent,
                borrower,
                receiver,
                collateralToken,
                loanData
            ]);
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
            const abiEncoder = self._lookupAbiEncoder("borrowTokenFromDeposit(bytes32,uint256,uint256,uint256,address,address,address,bytes)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public checkpointPrice = {
        async callAsync(_user: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("checkpointPrice(address)", [_user]);
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
            const abiEncoder = self._lookupAbiEncoder("checkpointPrice(address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public marketLiquidity = {
        async callAsync(callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("marketLiquidity()", []);
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
            const abiEncoder = self._lookupAbiEncoder("marketLiquidity()");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public getDepositAmountForBorrow = {
        async callAsync(
            borrowAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralToken: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments("getDepositAmountForBorrow(uint256,uint256,address)", [
                borrowAmount,
                initialLoanDuration,
                collateralToken
            ]);
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
            const abiEncoder = self._lookupAbiEncoder("getDepositAmountForBorrow(uint256,uint256,address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public getBorrowAmountForDeposit = {
        async callAsync(
            depositAmount: BigNumber,
            initialLoanDuration: BigNumber,
            collateralToken: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments("getBorrowAmountForDeposit(uint256,uint256,address)", [
                depositAmount,

                initialLoanDuration,
                collateralToken
            ]);
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
            const abiEncoder = self._lookupAbiEncoder("getBorrowAmountForDeposit(uint256,uint256,address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public nextBorrowInterestRateWithOption = {
        async callAsync(
            borrowAmount: BigNumber,
            useFixedInterestModel: boolean,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments("nextBorrowInterestRateWithOption(uint256,bool)", [
                borrowAmount,
                useFixedInterestModel
            ]);
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
            const abiEncoder = self._lookupAbiEncoder("nextBorrowInterestRateWithOption(uint256,bool)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public allowance = {
        async callAsync(
            _owner: string,
            _spender: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<BigNumber> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("allowance(address,address)", [_owner, _spender]);
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
            const abiEncoder = self._lookupAbiEncoder("allowance(address,address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public approve = {
        async sendTransactionAsync(_spender: string, _value: BigNumber, txData: Partial<TxData> = {}): Promise<string> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("approve(address,uint256)", [_spender, _value]);
            const txDataWithDefaults = await BaseContract._applyDefaultsToTxDataAsync(
                {
                    to: self.address,
                    ...txData,
                    data: encodedData
                },
                self._web3Wrapper.getContractDefaults(),
                (self as any).approve.estimateGasAsync.bind(self, _spender, _value)
            );
            const txHash = await self._web3Wrapper.sendTransactionAsync(txDataWithDefaults);
            return txHash;
        },
        async estimateGasAsync(_spender: string, _value: BigNumber, txData: Partial<TxData> = {}): Promise<number> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("approve(address,uint256)", [_spender, _value]);
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
        getABIEncodedTransactionData(_spender: string, _value: BigNumber): string {
            const self = (this as any) as iTokenContract;
            const abiEncodedTransactionData = self._strictEncodeArguments("approve(address,uint256)", [_spender, _value]);
            return abiEncodedTransactionData;
        },
        async callAsync(
            _spender: string,
            _value: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<boolean> {
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("approve(address,uint256)", [_spender, _value]);
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
            const abiEncoder = self._lookupAbiEncoder("approve(address,uint256)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<boolean>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };
    public assetBalanceOf = {
        async callAsync(_owner: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("assetBalanceOf(address)", [_owner]);
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
            const abiEncoder = self._lookupAbiEncoder("assetBalanceOf(address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public profitOf = {
        async callAsync(_owner: string, callData: Partial<CallData> = {}, defaultBlock?: BlockParam): Promise<BigNumber> {
            callData.from = "0x4abB24590606f5bf4645185e20C4E7B97596cA3B";
            const self = (this as any) as iTokenContract;
            const encodedData = self._strictEncodeArguments("profitOf(address)", [_owner]);
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
            const abiEncoder = self._lookupAbiEncoder("profitOf(address)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<BigNumber>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public loanIdes = {
        async callAsync(
            index_0: BigNumber,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<string> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments("loanIdes(uint256)", [index_0
            ]);
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
            const abiEncoder = self._lookupAbiEncoder("loanIdes(uint256)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<string>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    public loanOrderData = {
        async callAsync(
            index_0: string,
            callData: Partial<CallData> = {},
            defaultBlock?: BlockParam
        ): Promise<[string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]> {
            const self = this as any as iTokenContract;
            const encodedData = self._strictEncodeArguments("loanOrderData(bytes32)", [index_0
            ]);
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
            const abiEncoder = self._lookupAbiEncoder("loanOrderData(bytes32)");
            // tslint:disable boolean-naming
            const result = abiEncoder.strictDecodeReturnValue<[string, BigNumber, BigNumber, BigNumber, BigNumber, BigNumber]>(rawCallResult);
            // tslint:enable boolean-naming
            return result;
        }
    };

    constructor(abi: ContractAbi, address: string, provider: any, txDefaults?: Partial<TxData>) {
        super("iToken", abi, address.toLowerCase(), provider as SupportedProvider, txDefaults);
        classUtils.bindAll(this, ["_abiEncoderByFunctionSignature", "address", "abi", "_web3Wrapper"]);
    }
} // tslint:disable:max-file-line-count
// tslint:enable:no-unbound-method
