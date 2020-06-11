import { BigNumber } from "@0x/utils";
import { RequestTask } from "../../domain/RequestTask";
import { TradeRequest } from "../../domain/TradeRequest";
import { FulcrumProvider } from "../FulcrumProvider";

import { PositionType } from "../../domain/PositionType";
import { AssetsDictionary } from "../../domain/AssetsDictionary";

export class TradeSellEthProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: TradeRequest = (task.request as TradeRequest);
    const isLong = taskRequest.positionType === PositionType.LONG;


    const loan = (await FulcrumProvider.Instance.getUserMarginTradeLoans())
      .find(l => l.loanId === taskRequest.loanId);
    if (!loan)
      throw new Error("No loan available!");


    let amountInBaseUnits = new BigNumber(0);
    if (!isLong) {
      const decimals: number = AssetsDictionary.assets.get(taskRequest.collateral)!.decimals || 18;
      amountInBaseUnits = new BigNumber(loan.loanData!.collateral.times(taskRequest.amount).div(loan.loanData!.principal).multipliedBy(10 ** decimals).toFixed(0, 1));
    }
    else {
      const decimals: number = AssetsDictionary.assets.get(taskRequest.asset)!.decimals || 18;
      amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** decimals).toFixed(0, 1));
    }

    let maxAmountInBaseUnits = new BigNumber(0);
    if (loan) {
      maxAmountInBaseUnits = loan.loanData!.collateral;
    }

    if (maxAmountInBaseUnits.gt(0) && (maxAmountInBaseUnits.minus(amountInBaseUnits)).abs().div(maxAmountInBaseUnits).lte(0.01)) {
      console.log("close full amount")
      amountInBaseUnits = new BigNumber(maxAmountInBaseUnits.times(10 ** 50).toFixed(0, 1));
    }

    const iBZxContract = await FulcrumProvider.Instance.contractsSource.getiBZxContract();
    if (!iBZxContract) {
      throw new Error("No iBZxContract contract available!");
    }

    task.processingStart([
      "Initializing",
      "Closing trade",
      "Updating the blockchain",
      "Transaction completed"
    ]);

    // no additional inits or checks
    task.processingStepNext();

    let gasAmountBN;

    if (skipGas) {
      gasAmountBN = new BigNumber(FulcrumProvider.Instance.gasLimit);
    } else {
      // estimating gas amount
      let gasAmount;
      try {
        gasAmount = await iBZxContract.closeWithSwap.estimateGasAsync(
          taskRequest.loanId!,
          account,
          amountInBaseUnits,
          taskRequest.returnTokenIsCollateral,
          "0x",
          {
            from: account,
            gas: FulcrumProvider.Instance.gasLimit,
          });
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);

      }
      catch (e) {
        console.log(e);
        // throw e;
      }

    }

    let txHash: string = "";
    try {
      console.log("amountInBaseUnits " + amountInBaseUnits)
      // Closing trade
      txHash = await iBZxContract.closeWithSwap.sendTransactionAsync(
        taskRequest.loanId!,
        account,
        amountInBaseUnits,
        taskRequest.returnTokenIsCollateral,
        "0x",
        {
          from: account,
          gas: FulcrumProvider.Instance.gasLimit,
          gasPrice: await FulcrumProvider.Instance.gasPrice()
        });


      task.setTxHash(txHash);
    }
    catch (e) {
      console.log(e);
      // throw e;
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
