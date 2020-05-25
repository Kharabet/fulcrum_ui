import { BigNumber } from "@0x/utils";
import { AssetsDictionary } from "../../domain/AssetsDictionary";
import { ManageCollateralRequest } from "../../domain/ManageCollateralRequest";
import { RequestTask } from "../../domain/RequestTask";
import { TorqueProvider } from "../TorqueProvider";
import { erc20Contract } from "../../contracts/erc20";

export class ManageCollateralProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (!(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)) {
      throw new Error("No provider available!");
    }

    // Initializing loan
    const taskRequest: ManageCollateralRequest = (task.request as ManageCollateralRequest);
    const isETHCollateralAsset = TorqueProvider.Instance.isETHAsset(taskRequest.loanOrderState.collateralAsset);

    if (isETHCollateralAsset) {
      task.processingStart([
        "Initializing",
        "Submitting loan",
        "Updating the blockchain",
        "Transaction completed"
      ]);
    } else {
      task.processingStart([
        "Initializing",
        "Detecting token allowance",
        "Prompting token allowance",
        "Waiting for token allowance",
        "Submitting loan",
        "Updating the blockchain",
        "Transaction completed"
      ]);
    }

    // Initializing loan
    let bZxContract = await TorqueProvider.Instance.contractsSource.getiBZxContract();

    if (!bZxContract) {
      throw new Error("No bzxContract contract available!");
    }

    const collateralPrecision = AssetsDictionary.assets.get(taskRequest.loanOrderState.collateralAsset)!.decimals || 18;
    let collateralAmountInBaseUnits = taskRequest.collateralAmount.multipliedBy(10 ** collateralPrecision);
    const collateralAmountInBaseUnitsValue = new BigNumber(collateralAmountInBaseUnits.toFixed(0, 1));
    collateralAmountInBaseUnits = new BigNumber(collateralAmountInBaseUnits.toFixed(0, 1));

    if (!isETHCollateralAsset) {

      let tokenErc20Contract: erc20Contract | null = null;
      let assetErc20Address: string | null = "";
      let erc20allowance = new BigNumber(0);
      assetErc20Address = TorqueProvider.Instance.getErc20AddressOfAsset(taskRequest.loanOrderState.collateralAsset);
      if (assetErc20Address) {
        tokenErc20Contract = await TorqueProvider.Instance.contractsSource.getErc20Contract(assetErc20Address);
      } else {
        throw new Error("No ERC20 contract available!");
      }

      if (!tokenErc20Contract) {
        throw new Error("No ERC20 contract available!");
      }
      // Detecting token allowance
      task.processingStepNext();
      erc20allowance = await tokenErc20Contract.allowance.callAsync(account, TorqueProvider.Instance.contractsSource.getVaultAddress().toLowerCase());

      // Prompting token allowance
      task.processingStepNext();

      // Waiting for token allowance
      task.processingStepNext();
      if (collateralAmountInBaseUnits.gt(erc20allowance)) {
        await tokenErc20Contract!.approve.sendTransactionAsync(TorqueProvider.Instance.contractsSource.getVaultAddress().toLowerCase(), TorqueProvider.MAX_UINT, { from: account });
      }
    }

    //Submitting loan
    task.processingStepNext();

    let gasAmountBN;
    let txHash: string = "";

    if (!taskRequest.isWithdrawal) {
      try {
        const gasAmount = await bZxContract.depositCollateral.estimateGasAsync(
          taskRequest.loanOrderState.loanData!.loanId,
          collateralAmountInBaseUnits,
          {
            from: account,
            value: isETHCollateralAsset ?
              collateralAmountInBaseUnitsValue :
              undefined,
            gas: TorqueProvider.Instance.gasLimit
          }
        );
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(TorqueProvider.Instance.gasBufferCoeff).integerValue(BigNumber.ROUND_UP);
      } catch (e) {
        console.log(e);
        throw e;
      }

      try {
        txHash = await bZxContract.depositCollateral.sendTransactionAsync(
          taskRequest.loanOrderState.loanData!.loanId,           // loanId
          collateralAmountInBaseUnits,                           // depositAmount
          {
            from: account,
            value: isETHCollateralAsset ?
              collateralAmountInBaseUnitsValue :
              undefined,
            gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
            gasPrice: await TorqueProvider.Instance.gasPrice()
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
          taskRequest.loanOrderState.loanData!.loanId,
          account,
          collateralAmountInBaseUnits,
          {
            from: account,
            gas: TorqueProvider.Instance.gasLimit
          }
        );
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(2).integerValue(BigNumber.ROUND_UP);
      } catch (e) {
        console.log(e);
        throw e;
      }

      try {

        txHash = await bZxContract.withdrawCollateral.sendTransactionAsync(
          taskRequest.loanOrderState.loanData!.loanId,                                // loanId
          account,                                                                    // trader
          collateralAmountInBaseUnits,                                                // depositAmount
          {
            from: account,
            gas: gasAmountBN ? gasAmountBN.toString() : "3000000",
            gasPrice: await TorqueProvider.Instance.gasPrice()
          }
        );
        task.setTxHash(txHash);
      }
      catch (e) {
        console.log(e);
        throw e;
      }
    }

    //Updating the blockchain
    task.processingStepNext();
    const txReceipt = await TorqueProvider.Instance.waitForTransactionMined(txHash);
    if (!txReceipt.status) {
      throw new Error("Reverted by EVM");
    }

    //Transaction completed
    task.processingStepNext();
    await TorqueProvider.Instance.sleep(TorqueProvider.Instance.successDisplayTimeout);
  }
}
