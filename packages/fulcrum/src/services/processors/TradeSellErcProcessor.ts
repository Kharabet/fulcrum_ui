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

export class TradeSellErcProcessor {
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
    let decimals: number = AssetsDictionary.assets.get(key.loanAsset)!.decimals || 18;
    if (key.loanAsset === Asset.WBTC && key.positionType === PositionType.SHORT) {
      decimals = decimals + 10;
    }

    const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** decimals).toFixed(0, 1));
    const tokenContract: pTokenContract | null = await FulcrumProvider.Instance.contractsSource.getPTokenContract(key);

    if (!tokenContract) {
      throw new Error("No pToken contract available!");
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

    // Submitting unloan
    const assetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(taskRequest.collateral);
    if (assetErc20Address) {
      // Waiting for token allowance
      if (skipGas) {
        gasAmountBN = new BigNumber(FulcrumProvider.Instance.gasLimit);
      } else {
        // estimating gas amount
        let gasAmount;
        if (taskRequest.version === 2 && taskRequest.loanDataBytes) {
          gasAmount = await tokenContract.burnToToken.estimateGasAsync(
            account,
            assetErc20Address,
            amountInBaseUnits,
            new BigNumber(0),
            taskRequest.loanDataBytes,
            {
              from: account,
              gas: FulcrumProvider.Instance.gasLimit,
              value: taskRequest.zeroXFee ?
                taskRequest.zeroXFee :
                0
            }
          );
        } else {
          gasAmount = await tokenContract.burnToTokenNoBytes.estimateGasAsync(
            account,
            assetErc20Address,
            amountInBaseUnits,
            new BigNumber(0),
            {
              from: account,
              gas: FulcrumProvider.Instance.gasLimit,
              value: 0
            }
          );
        }
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
      }

      let txHash: string = "";
      try {
        FulcrumProvider.Instance.eventEmitter.emit(FulcrumProviderEvents.AskToOpenProgressDlg);

        // Closing trade
        if (taskRequest.version === 2 && taskRequest.loanDataBytes) {
          txHash = await tokenContract.burnToToken.sendTransactionAsync(
            account,
            assetErc20Address,
            amountInBaseUnits,
            new BigNumber(0),
            taskRequest.loanDataBytes,
            { 
              from: account,
              gas: gasAmountBN.toString(),
              gasPrice: await FulcrumProvider.Instance.gasPrice(),
              value: taskRequest.zeroXFee ?
                taskRequest.zeroXFee :
                0
            }
          );
        } else {
          txHash = await tokenContract.burnToTokenNoBytes.sendTransactionAsync(
            account,
            assetErc20Address,
            amountInBaseUnits,
            new BigNumber(0),
            { 
              from: account,
              gas: gasAmountBN.toString(),
              gasPrice: await FulcrumProvider.Instance.gasPrice(),
              value: 0
            }
          );
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
}
