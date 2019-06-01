import { BigNumber } from "bignumber.js";
import { iTokenContract } from "../../contracts/iTokenContract";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { LendRequest } from "../../domain/LendRequest";
import { RequestTask } from "../../domain/RequestTask";
import { FulcrumProviderEvents } from "../events/FulcrumProviderEvents";
import { FulcrumProvider } from "../FulcrumProvider";

export class LendEthProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: LendRequest = (task.request as LendRequest);
    const decimals: number = AssetsDictionary.assets.get(taskRequest.asset)!.decimals || 18;
    const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** decimals).toFixed(0, 1));
    const tokenContract: iTokenContract | null = await FulcrumProvider.Instance.contractsSource.getITokenContract(taskRequest.asset);
    if (!tokenContract) {
      throw new Error("No iToken contract available!");
    }

    task.processingStart([
      "Initializing",
      "Submitting loan",
      "Updating the blockchain",
      "Transaction completed"
    ]);

    // no additional inits or checks
    task.processingStepNext();

    let gasAmountBN;

    // Waiting for token allowance
    if (skipGas) {
      gasAmountBN = new BigNumber(2300000);
    } else {
      // estimating gas amount
      const gasAmount = await tokenContract.mintWithEther.estimateGasAsync(account, { from: account, value: amountInBaseUnits, gas: FulcrumProvider.Instance.gasLimit });
      gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
    }

    const gasCost = gasAmountBN.multipliedBy(FulcrumProvider.Instance.gasPrice).integerValue(BigNumber.ROUND_UP);

    FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

    // Submitting loan
    const txHash = await tokenContract.mintWithEther.sendTransactionAsync(account, { from: account, value: amountInBaseUnits, gas: gasAmountBN.toString() });
    task.setTxHash(txHash);

    FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToCloseProgressDlg);

    task.processingStepNext();
    const txReceipt = await FulcrumProvider.Instance.waitForTransactionMined(txHash, task.request);
    if (!txReceipt.status) {
      throw new Error("Reverted by EVM");
    }

    task.processingStepNext();
    await FulcrumProvider.Instance.sleep(FulcrumProvider.Instance.successDisplayTimeout);
  }
}
