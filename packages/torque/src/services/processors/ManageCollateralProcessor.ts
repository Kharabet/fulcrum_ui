import ethGasStation from 'bzx-common/src/lib/apis/ethGasStation'
import { BigNumber } from '@0x/utils'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'
import { ManageCollateralRequest } from '../../domain/ManageCollateralRequest'
import { RequestTask } from 'app-lib/tasksQueue'
import { TorqueProvider } from '../TorqueProvider'
import { erc20Contract } from 'bzx-common/src/contracts/typescript-wrappers/erc20'
import Asset from 'bzx-common/src/assets/Asset'
import providerUtils from 'bzx-common/src/lib/providerUtils'

export class ManageCollateralProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (
      !(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)
    ) {
      throw new Error('No provider available!')
    }

    // Initializing loan
    const taskRequest: ManageCollateralRequest = task.request as ManageCollateralRequest
    const isETHCollateralAsset = providerUtils.isNativeToken(taskRequest.collateralAsset)

    if (isETHCollateralAsset) {
      task.processingStart([
        'Initializing',
        'Submitting loan',
        'Updating the blockchain',
        'Transaction completed',
      ])
    } else {
      task.processingStart([
        'Initializing',
        'Detecting token allowance',
        'Prompting token allowance',
        'Waiting for token allowance',
        'Submitting loan',
        'Updating the blockchain',
        'Transaction completed',
      ])
    }

    // Initializing loan
    const bZxContract = await TorqueProvider.Instance.contractsSource.getiBZxContract()

    if (!bZxContract) {
      throw new Error('No bzxContract contract available!')
    }

    const collateralPrecision =
      AssetsDictionary.assets.get(taskRequest.collateralAsset)!.decimals || 18
    let collateralAmountInBaseUnits = taskRequest.collateralAmount.multipliedBy(
      10 ** collateralPrecision
    )
    const collateralAmountInBaseUnitsValue = new BigNumber(
      collateralAmountInBaseUnits.toFixed(0, 1)
    )
    collateralAmountInBaseUnits = new BigNumber(collateralAmountInBaseUnits.toFixed(0, 1))

    if (!isETHCollateralAsset) {
      let tokenErc20Contract: erc20Contract | null = null
      let assetErc20Address: string | null = ''
      let erc20allowance = new BigNumber(0)
      assetErc20Address = providerUtils.getErc20AddressOfAsset(taskRequest.collateralAsset)
      if (assetErc20Address) {
        tokenErc20Contract = await TorqueProvider.Instance.contractsSource.getErc20Contract(
          assetErc20Address
        )
      } else {
        throw new Error('No ERC20 contract available!')
      }

      if (!tokenErc20Contract) {
        throw new Error('No ERC20 contract available!')
      }
      // Detecting token allowance
      task.processingStepNext()
      erc20allowance = await tokenErc20Contract
        .allowance(
          account,
          TorqueProvider.Instance.contractsSource.getBZxVaultAddress().toLowerCase()
        )
        .callAsync()

      // Prompting token allowance
      task.processingStepNext()

      // Waiting for token allowance
      task.processingStepNext()
      if (collateralAmountInBaseUnits.gt(erc20allowance)) {
        const spender = TorqueProvider.Instance.contractsSource.getBZxVaultAddress().toLowerCase()
        const approveHash = await TorqueProvider.Instance.setApproval(
          spender,
          taskRequest.collateralAsset,
          TorqueProvider.Instance.getLargeApprovalAmount(
            taskRequest.collateralAsset,
            collateralAmountInBaseUnits
          )
        )
        await TorqueProvider.Instance.waitForTransactionMined(approveHash)
      }
    }

    //Submitting loan
    task.processingStepNext()

    let gasAmountBN
    let txHash = ''

    if (!taskRequest.isWithdrawal) {
      try {
        const gasAmount = await bZxContract
          .depositCollateral(taskRequest.loanId, collateralAmountInBaseUnits)
          .estimateGasAsync({
            from: account,
            value: isETHCollateralAsset ? collateralAmountInBaseUnitsValue : undefined,
            gas: TorqueProvider.Instance.gasLimit,
          })
        gasAmountBN = new BigNumber(gasAmount)
          .multipliedBy(TorqueProvider.Instance.gasBufferCoeff)
          .integerValue(BigNumber.ROUND_UP)
      } catch (e) {
        // throw e
      }

      try {
        txHash = await bZxContract
          .depositCollateral(
            taskRequest.loanId, // loanId
            collateralAmountInBaseUnits // depositAmount
          )
          .sendTransactionAsync({
            from: account,
            value: isETHCollateralAsset ? collateralAmountInBaseUnitsValue : undefined,
            gas: gasAmountBN ? gasAmountBN.toString() : '3000000',
            gasPrice: await ethGasStation.getGasPrice(),
          })
        task.setTxHash(txHash)
      } catch (e) {
        throw e
      }
    } else {
      try {
        const gasAmount = await bZxContract
          .withdrawCollateral(taskRequest.loanId, account, collateralAmountInBaseUnits)
          .estimateGasAsync({
            from: account,
            gas: TorqueProvider.Instance.gasLimit,
          })
        gasAmountBN = new BigNumber(gasAmount).multipliedBy(2).integerValue(BigNumber.ROUND_UP)
      } catch (e) {
        // throw e
      }

      try {
        txHash = await bZxContract
          .withdrawCollateral(
            taskRequest.loanId, // loanId
            account, // trader
            collateralAmountInBaseUnits // depositAmount
          )
          .sendTransactionAsync({
            from: account,
            gas: gasAmountBN ? gasAmountBN.toString() : '3000000',
            gasPrice: await ethGasStation.getGasPrice(),
          })
        task.setTxHash(txHash)
      } catch (e) {
        throw e
      }
    }

    //Updating the blockchain
    task.processingStepNext()
    const txReceipt = await TorqueProvider.Instance.waitForTransactionMined(txHash)
    if (!txReceipt.status) {
      throw new Error('Reverted by EVM')
    }

    //Transaction completed
    task.processingStepNext()
    await TorqueProvider.Instance.sleep(TorqueProvider.Instance.successDisplayTimeout)
  }
}
