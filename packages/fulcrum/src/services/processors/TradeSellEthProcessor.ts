import { BigNumber } from "@0x/utils";
import { pTokenContract } from "../../contracts/pTokenContract";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { RequestTask } from "../../domain/RequestTask";
import { TradeRequest } from "../../domain/TradeRequest";
import { TradeTokenKey } from "../../domain/TradeTokenKey";
import { FulcrumProviderEvents } from "../events/FulcrumProviderEvents";
import { FulcrumProvider } from "../FulcrumProvider";

import { Asset } from "../../domain/Asset";
import { PositionType } from "../../domain/PositionType";

export class TradeSellEthProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: TradeRequest = (task.request as TradeRequest);
    const isLong = taskRequest.positionType === PositionType.LONG;


    const loanToken = isLong
      ? taskRequest.collateral
      : Asset.ETH;
    const depositToken = taskRequest.depositToken;
    const collateralToken = isLong
      ? Asset.ETH
      : taskRequest.collateral;

    const loans = await FulcrumProvider.Instance.getUserMarginTradeLoans();
    const amountInBaseUnits = loans.find(l => l.loanId === taskRequest.loanId)!.loanData!.collateral.times(10**50); //new BigNumber("525478543208365722")// new BigNumber(taskRequest.amount.multipliedBy(10 ** decimals).toFixed(0, 1));

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
      gasAmount = await iBZxContract.closeWithSwap.estimateGasAsync(
        taskRequest.loanId!,
        account,
        amountInBaseUnits,
        true, // returnTokenIsCollateral
        "0x",
        {
          from: account,
          gas: FulcrumProvider.Instance.gasLimit,
        });

      gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
    }

    let txHash: string = "";
    try {
      //FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

      // Closing trade
      txHash = await iBZxContract.closeWithSwap.sendTransactionAsync(
        taskRequest.loanId!,
        account,
        amountInBaseUnits,
        true, // returnTokenIsCollateral
        "0x",
        {
          from: account,
          gas: FulcrumProvider.Instance.gasLimit,
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
