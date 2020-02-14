import { BigNumber } from "@0x/utils";
import { pTokenContract } from "../../contracts/pTokenContract";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { RequestTask } from "../../domain/RequestTask";
import { TradeRequest } from "../../domain/TradeRequest";
import { TradeTokenKey } from "../../domain/TradeTokenKey";
import { FulcrumProviderEvents } from "../events/FulcrumProviderEvents";
import { FulcrumProvider } from "../FulcrumProvider";

export class TradeBuyEthProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: TradeRequest = (task.request as TradeRequest);
    const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** 18).toFixed(0, 1)); // ETH -> 18 decimals
    const tokenContract: pTokenContract | null =
      await FulcrumProvider.Instance.contractsSource.getPTokenContract(
        new TradeTokenKey(
          taskRequest.asset,
          taskRequest.unitOfAccount,
          taskRequest.positionType,
          taskRequest.leverage,
          taskRequest.isTokenized,
          taskRequest.version
        )
      );
    if (!tokenContract) {
      throw new Error("No pToken contract available!");
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

    // Waiting for token allowance
    if (skipGas) {
      gasAmountBN = new BigNumber(FulcrumProvider.Instance.gasLimit);
    } else {
      // estimating gas amount
      const gasAmount = await tokenContract.mintWithEther.estimateGasAsync(account, { from: account, value: amountInBaseUnits, gas: FulcrumProvider.Instance.gasLimit });
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
    }

    let txHash: string = "";
    try {
      FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

      // Submitting trade
      txHash = await tokenContract.mintWithEther.sendTransactionAsync(account, {
        from: account,
        value: amountInBaseUnits,
        gas: gasAmountBN.toString(),
        gasPrice: await FulcrumProvider.Instance.gasPrice()
      });
      task.setTxHash(txHash);
    }
    finally {
      FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToCloseProgressDlg);
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
