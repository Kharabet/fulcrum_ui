import { BigNumber } from '@0x/utils'
import { RequestTask } from '../../domain/RequestTask'
import { RolloverRequest } from '../../domain/RolloverRequest'

import { ExplorerProvider } from '../ExplorerProvider'

export class RolloverProcessor {
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
    const taskRequest: RolloverRequest = task.request as RolloverRequest
      task.processingStart([
        'Initializing',
        'Submitting transaction',
        'Updating the blockchain',
        'Transaction completed'
      ])

    // Initializing loan
    const iBZxContract = await ExplorerProvider.Instance.contractsSource.getiBZxContract()

    if (!iBZxContract) {
      throw new Error('No bzxContract contract available!')
    }


    // Submitting txn
    task.processingStepNext()

    let gasAmountBN = new BigNumber(0)
    const txHash: string = ''

    const loanData = '0x'
    try {
      const gasAmount = await iBZxContract.rollover.estimateGasAsync(
        taskRequest.loanId,
        loanData,
        {
          from: account,
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
      const txHash = await iBZxContract.rollover.sendTransactionAsync(
        taskRequest.loanId,
        loanData,
        {
          from: account,
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
