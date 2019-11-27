import { BigNumber } from "bignumber.js";
import { erc20Contract } from "../../contracts/erc20";
import { FulcrumMcdBridgeContract } from "../../contracts/FulcrumMcdBridgeContract";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { FulcrumMcdBridgeRequest } from "../../domain/FulcrumMcdBridgeRequest";
import { RequestTask } from "../../domain/RequestTask";
import { FulcrumProviderEvents } from "../events/FulcrumProviderEvents";
import { FulcrumProvider } from "../FulcrumProvider";

export class FulcrumMcdBridgeProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: FulcrumMcdBridgeRequest = (task.request as FulcrumMcdBridgeRequest);
    const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** 18).toFixed(0, 1));
    const bridgeContract: FulcrumMcdBridgeContract | null = await FulcrumProvider.Instance.contractsSource.getFulcrumMcdBridgeContract();

    const isSAIUpgrade = taskRequest.isSAIUpgrade();
    if (!bridgeContract) {
      throw new Error("No Bridge contract available!");
    }

    task.processingStart([
      "Initializing",
      "Detecting token allowance",
      "Prompting token allowance",
      "Waiting for token allowance",
      "Starting conversion",
      "Updating the blockchain",
      "Transaction completed"
    ]);

    // init erc20 contract for base token
    const assetContract = await FulcrumProvider.Instance.contractsSource.getITokenContract(taskRequest.asset);
    if (!assetContract) {
      throw new Error("No iToken contract available!");
    }

    task.processingStepNext();

    // Detecting token allowance
    let approvePromise: Promise<string> | null = null;
    const erc20allowance = await assetContract.allowance.callAsync(account, bridgeContract.address);
    task.processingStepNext();

    let txHash: string = "";
    try {
      FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

      // Prompting token allowance
      if (amountInBaseUnits.gt(erc20allowance)) {
        approvePromise = assetContract.approve.sendTransactionAsync(bridgeContract.address, FulcrumProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS, { from: account });
      }
      task.processingStepNext();
      task.processingStepNext();

      let gasAmountBN;
      // Waiting for token allowance
      if (approvePromise || skipGas) {
        await approvePromise;
        gasAmountBN = new BigNumber(3000000);
      } else {
        // estimating gas amount
        let gasAmount: number;
        if (isSAIUpgrade) {
          gasAmount = await bridgeContract.bridgeISaiToIDai.estimateGasAsync(amountInBaseUnits, { from: account, gas: FulcrumProvider.Instance.gasLimit });
        } else {
          gasAmount = await bridgeContract.bridgeIDaiToISai.estimateGasAsync(amountInBaseUnits, { from: account, gas: FulcrumProvider.Instance.gasLimit });
        }
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
      }

      if (isSAIUpgrade) {
        txHash = await bridgeContract.bridgeISaiToIDai.sendTransactionAsync(amountInBaseUnits, { 
          from: account,
          gas: gasAmountBN.toString(),
          gasPrice: await FulcrumProvider.Instance.gasPrice()
        });
      } else {
        txHash = await bridgeContract.bridgeIDaiToISai.sendTransactionAsync(amountInBaseUnits, { 
          from: account,
          gas: gasAmountBN.toString(),
          gasPrice: await FulcrumProvider.Instance.gasPrice()
        });
      }
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
