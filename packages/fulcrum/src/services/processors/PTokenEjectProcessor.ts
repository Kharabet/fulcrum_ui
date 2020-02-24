import { BigNumber } from "@0x/utils";
import { pTokenContract } from "../../contracts/pTokenContract";
import { RequestTask } from "../../domain/RequestTask";
import { TradeRequest } from "../../domain/TradeRequest";
import { TradeTokenKey } from "../../domain/TradeTokenKey";
import { FulcrumProviderEvents } from "../events/FulcrumProviderEvents";
import { FulcrumProvider } from "../FulcrumProvider";

import {BurnerContract} from "../../contracts/Burner"

export class PTokenEjectProcessor {
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
      "Detecting token allowance",
      "Prompting token allowance",
      "Ejecting",
      "Updating the blockchain",
      "Transaction completed"
    ]);

   
    
      task.processingStepNext();

      // Detecting token allowance
      pTokenAllowance = await tokenContract.allowance.callAsync(account, burnerContract.address);
      task.processingStepNext();

    try {
      FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

      // Prompting token allowance
      if (taskRequest.amount.gt(pTokenAllowance)) {
        approvePromise = tokenContract!.approve.sendTransactionAsync(burnerContract.address, taskRequest.amount, { from: account });
      }
      task.processingStepNext();
      task.processingStepNext();
    }
    catch(e) {
      console.error(e);
    }
    
    try {
      // Waiting for token allowance
      if (approvePromise || skipGas) {
        await approvePromise;
        gasAmountBN = new BigNumber(FulcrumProvider.Instance.gasLimit);
      } else {
        gasAmountBN = new BigNumber(FulcrumProvider.Instance.gasLimit);

        // estimating gas amount
      //   let gasAmount;
      //   if (taskRequest.version === 2 && taskRequest.loanDataBytes) {
      //     gasAmount = await burnerContract.deposit.estimateGasAsync(
      //       pTokenAddress,
      //       taskRequest.amount,
      //     {
      //       from: account,
      //       gas: FulcrumProvider.Instance.gasLimit,
      //       value: taskRequest.zeroXFee ?
      //       taskRequest.zeroXFee :
      //       0
      //     });
      //   } else {
      //     gasAmount = await burnerContract.deposit.estimateGasAsync(
      //       pTokenAddress,
      //       taskRequest.amount,
      //     {
      //       from: account,
      //       gas: FulcrumProvider.Instance.gasLimit,
      //       value: 0
      //     });
      //   }
        
        // gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
      }

      // Submitting trade
      if (taskRequest.version === 2 && taskRequest.loanDataBytes) {
        txHash = await burnerContract.deposit.sendTransactionAsync(
          pTokenAddress,
          taskRequest.amount,
        {
          from: account,
          gas: gasAmountBN,
          value: 0
        });
      } else {
        txHash = await burnerContract.deposit.sendTransactionAsync(
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
