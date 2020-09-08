import { BigNumber } from "@0x/utils";
import { RequestTask } from "../../domain/RequestTask";
import { ManageCollateralRequest } from "../../domain/ManageCollateralRequest";

import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { FulcrumProvider } from "../FulcrumProvider";
import { erc20Contract } from "../../contracts/erc20";

export class ManageCollateralProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(FulcrumProvider.Instance.contractsSource && FulcrumProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: ManageCollateralRequest = (task.request as ManageCollateralRequest);
    const isETHCollateralAsset = FulcrumProvider.Instance.isETHAsset(taskRequest.collateralAsset);


    if (isETHCollateralAsset) {
      task.processingStart([
        "Initializing",
        "Submitting collateral",
        "Updating the blockchain",
        "Transaction completed"
      ]);
    } else {
      task.processingStart([
        "Initializing",
        "Detecting token allowance",
        "Prompting token allowance",
        "Waiting for token allowance",
        "Submitting collateral",
        "Updating the blockchain",
        "Transaction completed"
      ]);
    }

    // Initializing loan
    let bZxContract = await FulcrumProvider.Instance.contractsSource.getiBZxContract();

    if (!bZxContract) {
      throw new Error("No bzxContract contract available!");
    }

    const collateralPrecision = AssetsDictionary.assets.get(taskRequest.collateralAsset)!.decimals || 18;
    let collateralAmountInBaseUnits = taskRequest.collateralAmount.multipliedBy(10 ** collateralPrecision);
    const collateralAmountInBaseUnitsValue = new BigNumber(collateralAmountInBaseUnits.toFixed(0, 1));
    collateralAmountInBaseUnits = new BigNumber(collateralAmountInBaseUnits.toFixed(0, 1));

    if (!isETHCollateralAsset) {

      let tokenErc20Contract: erc20Contract | null = null;
      let assetErc20Address: string | null = "";
      let erc20allowance = new BigNumber(0);
      assetErc20Address = FulcrumProvider.Instance.getErc20AddressOfAsset(taskRequest.collateralAsset);
      if (assetErc20Address) {
        tokenErc20Contract = await FulcrumProvider.Instance.contractsSource.getErc20Contract(assetErc20Address);
      } else {
        throw new Error("No ERC20 contract available!");
      }

      if (!tokenErc20Contract) {
        throw new Error("No ERC20 contract available!");
      }
      // Detecting token allowance
      task.processingStepNext();
      erc20allowance = await tokenErc20Contract.allowance.callAsync(account, FulcrumProvider.Instance.contractsSource.getBZxVaultAddress().toLowerCase());

      // Prompting token allowance
      task.processingStepNext();

      // Waiting for token allowance
      task.processingStepNext();
      if (collateralAmountInBaseUnits.gt(erc20allowance)) {
        const approveHash = await tokenErc20Contract!.approve.sendTransactionAsync(FulcrumProvider.Instance.contractsSource.getBZxVaultAddress().toLowerCase(), FulcrumProvider.Instance.getLargeApprovalAmount(taskRequest.collateralAsset, collateralAmountInBaseUnits), { from: account });
        await FulcrumProvider.Instance.waitForTransactionMined(approveHash, taskRequest);
      }
    }

    //Submitting loan
    task.processingStepNext();

    let gasAmountBN = new BigNumber(0);
    let txHash: string = "";

    if (!taskRequest.isWithdrawal) {
      try {
        const gasAmount = await bZxContract.depositCollateral.estimateGasAsync(
          taskRequest.loanId,
          collateralAmountInBaseUnits,
          {
            from: account,
            value: isETHCollateralAsset ?
              collateralAmountInBaseUnitsValue :
              undefined,
            gas: FulcrumProvider.Instance.gasLimit
          }
        );
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(FulcrumProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
      } catch (e) {
        console.log(e);
        throw e;
      }

      try {
        txHash = await bZxContract.depositCollateral.sendTransactionAsync(
          taskRequest.loanId,           // loanId
          collateralAmountInBaseUnits,                           // depositAmount
          {
            from: account,
            value: isETHCollateralAsset ?
              collateralAmountInBaseUnitsValue :
              undefined,
            gas: gasAmountBN.gt(0) ? gasAmountBN.toString() : "3000000",
            gasPrice: await FulcrumProvider.Instance.gasPrice()
          }
        );
        task.setTxHash(txHash);
      } catch (e) {
        console.log(e);
        throw e;
      }

    } else {

      try {
        const gasAmount = await bZxContract.withdrawCollateral.estimateGasAsync(
          taskRequest.loanId,
          account,
          collateralAmountInBaseUnits,
          {
            from: account,
            gas: FulcrumProvider.Instance.gasLimit
          }
        );
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(2).integerValue(BigNumber.ROUND_UP);
      } catch (e) {
        console.log(e);
        throw e;
      }

      try {

        txHash = await bZxContract.withdrawCollateral.sendTransactionAsync(
          taskRequest.loanId,                                // loanId
          account,                                                                    // trader
          collateralAmountInBaseUnits,                                                // depositAmount
          {
            from: account,
            gas: gasAmountBN.gt(0) ? gasAmountBN.toString() : "3000000",
            gasPrice: await FulcrumProvider.Instance.gasPrice()
          }
        );
        task.setTxHash(txHash);
      }
      catch (e) {
        console.log(e);
        throw e;
      }
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
