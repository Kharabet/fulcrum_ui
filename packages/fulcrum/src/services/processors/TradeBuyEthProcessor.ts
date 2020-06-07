import { BigNumber } from "@0x/utils";
import { RequestTask } from "../../domain/RequestTask";
import { TradeRequest } from "../../domain/TradeRequest";
import { FulcrumProvider } from "../FulcrumProvider";
import { PositionType } from "../../domain/PositionType";
import { Asset } from "../../domain/Asset";

export class TradeBuyEthProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: TradeRequest = (task.request as TradeRequest);
    const isLong = taskRequest.positionType === PositionType.LONG;
    const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** 18).toFixed(0, 1)); // ETH -> 18 decimals

    const loanToken = isLong
      ? taskRequest.collateral
      : Asset.ETH;
    const depositToken = taskRequest.depositToken;
    const collateralToken = isLong
      ? Asset.ETH
      : taskRequest.collateral;

    const tokenContract = await FulcrumProvider.Instance.contractsSource.getITokenContract(loanToken);
    if (!tokenContract) {
      throw new Error("No iToken contract available!");
    }

    task.processingStart([
      "Initializing",
      "Submitting trade",
      "Updating the blockchain",
      "Transaction completed"
    ]);

    // no additional inits or checks
    task.processingStepNext();

    let gasAmountBN;

    const leverageAmount = taskRequest.positionType === PositionType.LONG
      ? new BigNumber(taskRequest.leverage - 1).times(10 ** 18)
      : new BigNumber(taskRequest.leverage).times(10 ** 18);

    const loanTokenSent = depositToken === loanToken
      ? amountInBaseUnits
      : new BigNumber(0);

    const collateralTokenSent = depositToken === collateralToken
      ? amountInBaseUnits
      : new BigNumber(0);

    //const depositTokenAddress = FulcrumProvider.Instance.getErc20AddressOfAsset(depositToken);
    const collateralTokenAddress = FulcrumProvider.Instance.getErc20AddressOfAsset(collateralToken);
    const loanData = "0x";

    //console.log("depositAmount: " + amountInBaseUnits.toFixed());
    console.log("leverageAmount: " + leverageAmount.toFixed());
    console.log("loanTokenSent: " + loanTokenSent.toFixed());
    console.log("collateralTokenSent: " + collateralTokenSent.toFixed());
    //console.log("deposit token: " + depositToken + " address: " + depositTokenAddress!);
    console.log("collateral token: " + collateralToken + " address: " + collateralTokenAddress!);
    console.log("trader: " + account);
    console.log("loan data: " + loanData);

    // Waiting for token allowance
    if (skipGas) {
      gasAmountBN = new BigNumber(FulcrumProvider.Instance.gasLimit);
    } else {
      // estimating gas amount
      const gasAmount = await tokenContract.marginTrade.estimateGasAsync(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        leverageAmount,
        loanTokenSent,
        collateralTokenSent,
        collateralTokenAddress!,
        account,
        loanData,
        {
          from: account, value: amountInBaseUnits,
          gas: FulcrumProvider.Instance.gasLimit
        });
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
    }

    let txHash: string = "";
    try {
      //FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

      // Submitting trade
      txHash = await tokenContract.marginTrade.sendTransactionAsync(
        "0x0000000000000000000000000000000000000000000000000000000000000000",
        leverageAmount,
        loanTokenSent,
        collateralTokenSent,
        collateralTokenAddress!,
        account,
        loanData,
        {
          from: account,
          value: amountInBaseUnits,
          gas: gasAmountBN.toString(),
          gasPrice: await FulcrumProvider.Instance.gasPrice()
        });
      task.setTxHash(txHash);
    }
    catch (e) {
      throw e;
    }

    task.processingStepNext();
    const txReceipt = await FulcrumProvider.Instance.waitForTransactionMined(txHash, task.request);
    if (!txReceipt.status) {
      throw new Error("Reverted by EVM");
    }

    task.processingStepNext();
    await FulcrumProvider.Instance.sleep(FulcrumProvider.Instance.successDisplayTimeout);
  }
}
