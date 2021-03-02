import { BigNumber } from '@0x/utils'
import { iTokenContract } from 'bzx-common/src/contracts/typescript-wrappers/iTokenContract'
import AssetsDictionary from 'bzx-common/src/assets/AssetsDictionary'

import { LendRequest } from '../../domain/LendRequest'
import { RequestTask } from '../../domain/RequestTask'
import { FulcrumProviderEvents } from '../events/FulcrumProviderEvents'
import { FulcrumProvider } from '../FulcrumProvider'
import Asset from 'bzx-common/src/assets/Asset'

export class UnlendErcProcessor {
  public run = async (task: RequestTask, account: string, skipGas: boolean) => {
    if (FulcrumProvider.Instance.unsupportedNetwork) {
      throw new Error('You are connected to the wrong network!')
    }
    if (
      !(
        FulcrumProvider.Instance.contractsSource &&
        FulcrumProvider.Instance.contractsSource.canWrite
      )
    ) {
      throw new Error('No provider available!')
    }

    // Initializing loan
    const taskRequest: LendRequest = task.request as LendRequest
    const decimals: number = AssetsDictionary.assets.get(taskRequest.asset)!.decimals || 18
    let amountInBaseUnits = new BigNumber(
      taskRequest.amount.multipliedBy(10 ** decimals).toFixed(0, 1)
    )
    const tokenContract: iTokenContract | null = await FulcrumProvider.Instance.contractsSource.getITokenContract(
      taskRequest.asset
    )
    if (!tokenContract) {
      throw new Error('No iToken contract available!')
    }

    task.processingStart([
      'Initializing',
      'Closing loan',
      'Updating the blockchain',
      'Transaction completed',
    ])

    // no additional inits or checks
    task.processingStepNext()

    let gasAmountBN

    if (amountInBaseUnits.gt(FulcrumProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS)) {
      amountInBaseUnits = FulcrumProvider.UNLIMITED_ALLOWANCE_IN_BASE_UNITS
    }

    // console.log(
    //   tokenContract.address,
    //   await tokenContract.burn.getABIEncodedTransactionData(account, amountInBaseUnits)
    // )

    // Waiting for token allowance
    if (skipGas) {
      gasAmountBN = new BigNumber(600000)
    } else {
      // estimating gas amount
      const gasAmount = await tokenContract.burn(account, amountInBaseUnits).estimateGasAsync({
        from: account,
        gas: FulcrumProvider.Instance.gasLimit,
      })
      gasAmountBN = new BigNumber(gasAmount)
        .multipliedBy(FulcrumProvider.Instance.gasBufferCoeff)
        .integerValue(BigNumber.ROUND_UP)
    }

    let txHash: string = ''
    try {
      // Submitting unloan
      txHash = await tokenContract.burn(account, amountInBaseUnits).sendTransactionAsync({
        from: account,
        gas: gasAmountBN.toString(),
        gasPrice: await FulcrumProvider.Instance.gasPrice(),
      })
      task.setTxHash(txHash)
    } catch (e) {
      throw e
    }

    task.processingStepNext()
    const txReceipt = await FulcrumProvider.Instance.waitForTransactionMined(txHash, task.request)
    if (!txReceipt.status) {
      throw new Error('Reverted by EVM')
    }

    task.processingStepNext()
    await FulcrumProvider.Instance.sleep(FulcrumProvider.Instance.successDisplayTimeout)
  }
}
