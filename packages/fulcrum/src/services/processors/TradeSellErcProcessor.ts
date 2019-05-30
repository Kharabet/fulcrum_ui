import { BigNumber } from "bignumber.js";
import { pTokenContract } from "../../contracts/pTokenContract";
import { RequestTask } from "../../domain/RequestTask";
import { TradeRequest } from "../../domain/TradeRequest";
import { TradeTokenKey } from "../../domain/TradeTokenKey";
import { FulcrumProvider } from "../FulcrumProvider";

export class TradeSellErcProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: TradeRequest = (task.request as TradeRequest);
    const amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** 18).toFixed(0, 1));
    const tokenContract: pTokenContract | null =
      await FulcrumProvider.Instance.contractsSource.getPTokenContract(
        new TradeTokenKey(
          taskRequest.asset,
          taskRequest.unitOfAccount,
          taskRequest.positionType,
          taskRequest.leverage
        )
      );
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
    const assetErc20Address = FulcrumProvider.Instance.getErc20Address(taskRequest.collateral);
    if (assetErc20Address) {
      // Waiting for token allowance
      if (skipGas) {
        gasAmountBN = new BigNumber(2300000);
      } else {
        // estimating gas amount
        const gasAmount = await tokenContract.burnToToken.estimateGasAsync(
          account,
          assetErc20Address,
          amountInBaseUnits,
          { from: account, gas: FulcrumProvider.Instance.gasLimit }
        );
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
      }

      // Closing trade
      const txHash = await tokenContract.burnToToken.sendTransactionAsync(
        account,
        assetErc20Address,
        amountInBaseUnits,
        { from: account, gas: gasAmountBN.toString() }
      );
      task.setTxHash(txHash);

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
