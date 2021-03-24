import { BigNumber } from '@0x/utils'
import { erc20Contract } from 'bzx-common/src/contracts/typescript-wrappers/erc20'
import Asset from 'bzx-common/src/assets/Asset'
import { LiquidationRequest } from '../../domain/LiquidationRequest'
import { RequestTask } from 'app-lib/tasksQueue'
import { ExplorerProvider } from '../ExplorerProvider'
import providerUtils from 'bzx-common/src/lib/providerUtils'

export class LiquidationProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (
      !(
        ExplorerProvider.Instance.contractsSource &&
        ExplorerProvider.Instance.contractsSource.canWrite
      )
    ) {
      throw new Error('No provider available!')
    }

    // Initializing loan
    const iBZxContract = await ExplorerProvider.Instance.contractsSource.getiBZxContract()

    if (!iBZxContract) {
      throw new Error('No bzxContract contract available!')
    }
    const taskRequest = task.request

    if (!(taskRequest instanceof LiquidationRequest)) {
      throw new Error('Incorrect request type!')
    }
    let sendAmountForValue = new BigNumber(0)

    if (taskRequest.loanToken === Asset.WETH || taskRequest.loanToken === Asset.ETH) {
      task.processingStart([
        'Initializing',
        'Submitting collateral',
        'Updating the blockchain',
        'Transaction completed',
      ])
      sendAmountForValue = taskRequest.closeAmount
    } else {
      task.processingStart([
        'Initializing',
        'Detecting token allowance',
        'Prompting token allowance',
        'Waiting for token allowance',
        'Submitting collateral',
        'Updating the blockchain',
        'Transaction completed',
      ])

      let tokenErc20Contract: erc20Contract | null = null
      let assetErc20Address: string | null = ''
      let erc20allowance = new BigNumber(0)
      assetErc20Address = providerUtils.getErc20AddressOfAsset(taskRequest.loanToken)
      if (assetErc20Address) {
        tokenErc20Contract = await ExplorerProvider.Instance.contractsSource.getErc20Contract(
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
      erc20allowance = await tokenErc20Contract.allowance(account, iBZxContract.address).callAsync()

      // Prompting token allowance
      task.processingStepNext()

      // Waiting for token allowance
      task.processingStepNext()
      if (taskRequest.closeAmount.gt(erc20allowance)) {
        const approveHash = await ExplorerProvider.Instance.setApproval(
          iBZxContract.address,
          taskRequest.loanToken,
          ExplorerProvider.Instance.getLargeApprovalAmount(
            taskRequest.loanToken,
            taskRequest.closeAmount
          )
        )
        await ExplorerProvider.Instance.waitForTransactionMined(approveHash, taskRequest)
      }
    }

    // Submitting loan
    task.processingStepNext()

    let gasAmountBN = new BigNumber(0)
    let txHash: string = ''

    const isGasTokenEnabled = localStorage.getItem('isGasTokenEnabled') === 'true'
    const chiTokenBalance = await providerUtils.getAssetTokenBalanceOfUser(
      ExplorerProvider.Instance,
      Asset.CHI
    )

    try {
      const gasAmount =
        isGasTokenEnabled && chiTokenBalance.gt(0)
          ? await iBZxContract
              .liquidateWithGasToken(taskRequest.loanId, account, account, taskRequest.closeAmount)
              .estimateGasAsync({
                from: account,
                value: sendAmountForValue,
                gas: ExplorerProvider.Instance.gasLimit,
              })
          : await iBZxContract
              .liquidate(taskRequest.loanId, account, taskRequest.closeAmount)
              .estimateGasAsync({
                from: account,
                value: sendAmountForValue,
                gas: ExplorerProvider.Instance.gasLimit,
              })
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(ExplorerProvider.Instance.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (e) {
      // throw e
    }

    try {
      txHash =
        isGasTokenEnabled && chiTokenBalance.gt(0)
          ? await iBZxContract
              .liquidateWithGasToken(taskRequest.loanId, account, account, taskRequest.closeAmount)
              .sendTransactionAsync({
                from: account,
                value: sendAmountForValue,
                gas: gasAmountBN.toString(),
                gasPrice: await ExplorerProvider.Instance.gasPrice(),
              })
          : await iBZxContract
              .liquidate(taskRequest.loanId, account, taskRequest.closeAmount)
              .sendTransactionAsync({
                from: account,
                value: sendAmountForValue,
                gas: gasAmountBN.toString(),
                gasPrice: await ExplorerProvider.Instance.gasPrice(),
              })

      task.setTxHash(txHash)
    } catch (e) {
      throw e
    }

    task.processingStepNext()
    const txReceipt = await ExplorerProvider.Instance.waitForTransactionMined(txHash, task.request)
    if (!txReceipt.status) {
      throw new Error('Reverted by EVM')
    }

    task.processingStepNext()
    await ExplorerProvider.Instance.sleep(ExplorerProvider.Instance.successDisplayTimeout)
  }
}
