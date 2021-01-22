import { BigNumber } from '@0x/utils'
import Asset from 'bzx-common/src/assets/Asset'
import { RequestTask } from '../../domain/RequestTask'
import { RolloverRequest } from '../../domain/RolloverRequest'

import { TorqueProvider } from '../TorqueProvider'

export class RolloverProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (
      !(TorqueProvider.Instance.contractsSource && TorqueProvider.Instance.contractsSource.canWrite)
    ) {
      throw new Error('No provider available!')
    }

    // Initializing loan
    const taskRequest: RolloverRequest = task.request as RolloverRequest
    task.processingStart([
      'Initializing',
      'Submitting transaction',
      'Updating the blockchain',
      'Transaction completed',
    ])

    // Initializing loan
    const iBZxContract = await TorqueProvider.Instance.contractsSource.getiBZxContract()

    if (!iBZxContract) {
      throw new Error('No bzxContract contract available!')
    }

    // Submitting txn
    task.processingStepNext()

    let gasAmountBN = new BigNumber(0)
    let txHash: string = ''
    const isGasTokenEnabled = localStorage.getItem('isGasTokenEnabled') === 'true'
    const chiTokenBalance = await TorqueProvider.Instance.getAssetTokenBalanceOfUser(Asset.CHI)

    const loanData = '0x'
    try {
      const gasAmount =
        isGasTokenEnabled && chiTokenBalance.gt(0)
          ? await iBZxContract
              .rolloverWithGasToken(taskRequest.loanId, account, loanData)
              .estimateGasAsync({
                from: account,
                gas: TorqueProvider.Instance.gasLimit,
              })
          : await iBZxContract.rollover(taskRequest.loanId, loanData).estimateGasAsync({
              from: account,
              gas: TorqueProvider.Instance.gasLimit,
            })
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(TorqueProvider.Instance.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    } catch (e) {
      // throw e
    }

    try {
      txHash =
        isGasTokenEnabled && chiTokenBalance.gt(0)
          ? await iBZxContract
              .rolloverWithGasToken(taskRequest.loanId, account, loanData)
              .sendTransactionAsync({
                from: account,
                gas: gasAmountBN.toString(),
                gasPrice: await TorqueProvider.Instance.gasPrice(),
              })
          : await iBZxContract.rollover(taskRequest.loanId, loanData).sendTransactionAsync({
              from: account,
              gas: gasAmountBN.toString(),
              gasPrice: await TorqueProvider.Instance.gasPrice(),
            })

      task.setTxHash(txHash)
    } catch (e) {
      throw e
    }

    task.processingStepNext()
    const txReceipt = await TorqueProvider.Instance.waitForTransactionMined(txHash)
    if (!txReceipt.status) {
      throw new Error('Reverted by EVM')
    }

    task.processingStepNext()
    await TorqueProvider.Instance.sleep(TorqueProvider.Instance.successDisplayTimeout)
  }
}
