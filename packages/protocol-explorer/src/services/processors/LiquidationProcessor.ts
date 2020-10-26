import { BigNumber } from '@0x/utils'
import { RequestTask } from '../../domain/RequestTask'
import { LiquidationRequest } from '../../domain/LiquidationRequest'

import { ExplorerProvider } from '../ExplorerProvider'
import { erc20Contract } from '../../contracts/erc20'

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
    const taskRequest: LiquidationRequest = task.request as LiquidationRequest
    const isETHLoanToken = ExplorerProvider.Instance.isETHAsset(taskRequest.loanToken)

    if (isETHLoanToken) {
      task.processingStart([
        'Initializing',
        'Submitting collateral',
        'Updating the blockchain',
        'Transaction completed'
      ])
    } else {
      task.processingStart([
        'Initializing',
        'Detecting token allowance',
        'Prompting token allowance',
        'Waiting for token allowance',
        'Submitting collateral',
        'Updating the blockchain',
        'Transaction completed'
      ])
    }

    // Initializing loan
    let iBZxContract = await ExplorerProvider.Instance.contractsSource.getiBZxContract()

    if (!iBZxContract) {
      throw new Error('No bzxContract contract available!')
    }

    if (!isETHLoanToken) {
      let tokenErc20Contract: erc20Contract | null = null
      let assetErc20Address: string | null = ''
      let erc20allowance = new BigNumber(0)
      assetErc20Address = ExplorerProvider.Instance.getErc20AddressOfAsset(taskRequest.loanToken)
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
      erc20allowance = await tokenErc20Contract.allowance.callAsync(account, iBZxContract.address)

      // Prompting token allowance
      task.processingStepNext()

      // Waiting for token allowance
      task.processingStepNext()
      if (taskRequest.closeAmount.gt(erc20allowance)) {
        const approveHash = await ExplorerProvider.Instance.setApproval(
          iBZxContract.address,
          taskRequest.loanToken,
          taskRequest.closeAmount
        )
        await ExplorerProvider.Instance.waitForTransactionMined(approveHash, taskRequest)
      }
    }

    //Submitting loan
    task.processingStepNext()

    const sendAmountForValue = isETHLoanToken ? taskRequest.closeAmount : new BigNumber(0)

    let gasAmountBN = new BigNumber(0)
    let txHash: string = ''

    try {
      const gasAmount = await iBZxContract.liquidate.estimateGasAsync(
        taskRequest.loanId,
        account,
        taskRequest.closeAmount,
        {
          from: account,
          value: sendAmountForValue,
          gas: ExplorerProvider.Instance.gasLimit
        }
      )
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(ExplorerProvider.Instance.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (e) {
      console.log(e)
      throw e
    }

    try {
      const txHash = await iBZxContract.liquidate.sendTransactionAsync(
        taskRequest.loanId,
        account,
        taskRequest.closeAmount,
        {
          from: account,
          value: sendAmountForValue,
          gas: ExplorerProvider.Instance.gasLimit,
          gasPrice: await ExplorerProvider.Instance.gasPrice()
        }
      )

      task.setTxHash(txHash)
    } catch (e) {
      console.log(e)
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
