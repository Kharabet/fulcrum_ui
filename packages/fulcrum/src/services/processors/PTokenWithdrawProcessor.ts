import { BigNumber } from "@0x/utils";
import { pTokenContract } from "../../contracts/pTokenContract";
import { RequestTask } from "../../domain/RequestTask";
import { TradeRequest } from "../../domain/TradeRequest";
import { TradeTokenKey } from "../../domain/TradeTokenKey";
import { FulcrumProviderEvents } from "../events/FulcrumProviderEvents";
import { FulcrumProvider } from "../FulcrumProvider";

import {BurnerContract} from "../../contracts/Burner"

export class PTokenWithdrawProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: TradeRequest = (task.request as TradeRequest);
    const key = new TradeTokenKey(
      taskRequest.asset,
      taskRequest.unitOfAccount,
      taskRequest.positionType,
      taskRequest.leverage,
      taskRequest.isTokenized,
      taskRequest.version
    );
    
    const pTokenAddress = await FulcrumProvider.Instance.contractsSource.getPTokenErc20Address(key);
    if (!pTokenAddress) {
      throw new Error("No pToken address!");
    }

    const tokenContract: pTokenContract | null = await FulcrumProvider.Instance.contractsSource.getPTokenContract(key);

    if (!tokenContract) {
      throw new Error("No pToken contract available!");
    }

  
    const burnerContract: BurnerContract | null = await FulcrumProvider.Instance.contractsSource.getBurnerContract();

    if (!burnerContract) {
      throw new Error("No burner contract available!");
    }

    let approvePromise: Promise<string> | null = null;

    let pTokenAllowance = new BigNumber(0);
    let txHash: string = "";
    let gasAmountBN;

    task.processingStart([
      "Initializing",
      "Withdrawing",
      "Updating the blockchain",
      "Transaction completed"
    ]);

   
    
      task.processingStepNext();


    
    try {

      // Submitting trade
      if (taskRequest.version === 2 && taskRequest.loanDataBytes) {
        txHash = await burnerContract.withdraw.sendTransactionAsync(
          pTokenAddress,
          taskRequest.amount,
        {
          from: account,
          gas: gasAmountBN,
          value: 0
        });
      } else {
        txHash = await burnerContract.withdraw.sendTransactionAsync(
          pTokenAddress,
          taskRequest.amount,
        {
          from: account,
          gas: gasAmountBN,
          value: 0
        });
      }
      task.setTxHash(txHash);
    }
    catch(e) {
      console.error(e);
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
