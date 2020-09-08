import { BigNumber } from "@0x/utils";
import { RequestTask } from "../../domain/RequestTask";
import { TradeRequest } from "../../domain/TradeRequest";
import { FulcrumProvider } from "../FulcrumProvider";

import { PositionType } from "../../domain/PositionType";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { Asset } from "../../domain/Asset";

export class TradeSellProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: TradeRequest = (task.request as TradeRequest);
    const isLong = taskRequest.positionType === PositionType.LONG;


    const loan = (await FulcrumProvider.Instance.getUserMarginTradeLoans())
      .find(l => l.loanId === taskRequest.loanId);
    if (!loan || !loan.loanData)
      throw new Error("No loan available!");


    let amountInBaseUnits = new BigNumber(0);
    if (isLong) {
      const decimals: number = AssetsDictionary.assets.get(taskRequest.asset)!.decimals || 18;
      amountInBaseUnits = new BigNumber(taskRequest.amount.multipliedBy(10 ** decimals).toFixed(0, 1));
    }
    else {
      const decimals: number = AssetsDictionary.assets.get(taskRequest.asset)!.decimals || 18;
      amountInBaseUnits = new BigNumber(loan.loanData!.collateral.times(taskRequest.amount).div(loan.loanData!.principal).multipliedBy(10 ** decimals).toFixed(0, 1));

      const loanAssetDecimals = AssetsDictionary.assets.get(loan.loanAsset)!.decimals || 18;
      const collateralAssetDecimals = AssetsDictionary.assets.get(loan.collateralAsset)!.decimals || 18;

      const currentCollateralToPrincipalRate = await FulcrumProvider.Instance.getSwapRate(loan.collateralAsset, loan.loanAsset);
      const maxRequestAmount = loan.loanData.collateral.div(10 ** collateralAssetDecimals).times(currentCollateralToPrincipalRate).minus(loan.loanData.principal.div(10 ** loanAssetDecimals));
      amountInBaseUnits = new BigNumber(loan.loanData.collateral.times(taskRequest.amount.div(maxRequestAmount)).toFixed(0, 1));
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

    const isGasTokenEnabled = localStorage.getItem('isGasTokenEnabled') === "true";
    const ChiTokenBalance = await FulcrumProvider.Instance.getAssetTokenBalanceOfUser(Asset.CHI);

    if (skipGas) {
      gasAmountBN = new BigNumber(FulcrumProvider.Instance.gasLimit);
    } else {
      // estimating gas amount
      let gasAmount;
      try {
        gasAmount = isGasTokenEnabled && ChiTokenBalance.gt(0)
          ? await iBZxContract.closeWithSwapWithGasToken.estimateGasAsync(
            taskRequest.loanId!,
            account,
            account,
            amountInBaseUnits,
            taskRequest.returnTokenIsCollateral,
            "0x",
            {
              from: account,
              gas: FulcrumProvider.Instance.gasLimit,
            })
          : await iBZxContract.closeWithSwap.estimateGasAsync(
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
      txHash = isGasTokenEnabled && ChiTokenBalance.gt(0)
        ? await iBZxContract.closeWithSwapWithGasToken.sendTransactionAsync(
          taskRequest.loanId!,
          account,
          account,
          amountInBaseUnits,
          taskRequest.returnTokenIsCollateral,
          "0x",
          {
            from: account,
            gas: gasAmountBN,
            gasPrice: await FulcrumProvider.Instance.gasPrice()
          })
        : await iBZxContract.closeWithSwap.sendTransactionAsync(
          taskRequest.loanId!,
          account,
          amountInBaseUnits,
          taskRequest.returnTokenIsCollateral,
          "0x",
          {
            from: account,
            gas: gasAmountBN,
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
