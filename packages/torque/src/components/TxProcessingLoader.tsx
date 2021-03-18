import React, { Component } from 'react'
import { TasksQueue, TasksQueueEvents, RequestTask } from 'app-lib/tasksQueue'
import { Loader } from './Loader'
import { TorqueProvider } from '../services/TorqueProvider'

export interface ITxProcessingLoaderProps {
  taskId: number
  quantityDots: number
  sizeDots: string
  isOverlay: boolean
}

export interface ITxProcessingLoaderState {
  requestTask: RequestTask | undefined
}

export class TxProcessingLoader extends Component<
  ITxProcessingLoaderProps,
  ITxProcessingLoaderState
> {
  constructor(props: ITxProcessingLoaderProps) {
    super(props)

    this.state = {
      requestTask: TasksQueue.Instance.getTasksList().find(
        (t) => t.request.id === this.props.taskId
      ),
    }

    TasksQueue.Instance.on(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged)
    TasksQueue.Instance.on(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged)
  }

  public componentWillUnmount(): void {
    TasksQueue.Instance.off(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged)
    TasksQueue.Instance.off(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged)
  }

  public getTitle = () => {
    if (this.state.requestTask === undefined) return null
    let title = this.state.requestTask.steps.find(
      (s, i) => i + 1 === this.state.requestTask!.stepCurrent
    )
    if (!title) title = this.state.requestTask.status

    let errorMsg = ''
    if (this.state.requestTask.error) {
      if (this.state.requestTask.error.message) {
        errorMsg = this.state.requestTask.error.message
      } else if (typeof this.state.requestTask.error === 'string') {
        errorMsg = this.state.requestTask.error
      }

      if (errorMsg) {
        if (
          errorMsg.includes(
            `Request for method "eth_estimateGas" not handled by any subprovider`
          ) ||
          errorMsg.includes(`always failing transaction`)
        ) {
          errorMsg =
            'The transaction seems like it will fail. Change request parameters and try again, please.' //The transaction seems like it will fail. You can submit the transaction anyway, or cancel.
        } else if (errorMsg.includes('Reverted by EVM')) {
          errorMsg = 'The transaction failed. Reverted by EVM' //. Etherscan link:";
        } else if (errorMsg.includes('MetaMask Tx Signature: User denied transaction signature.')) {
          errorMsg = "You didn't confirm in MetaMask. Please try again."
        } else if (errorMsg.includes('User denied account authorization.')) {
          errorMsg = "You didn't authorize MetaMask. Please try again."
        } else if (errorMsg.includes('Transaction rejected')) {
          errorMsg = "You didn't confirm in Gnosis Safe. Please try again."
        } else {
          errorMsg = this.state.requestTask.status
        }
      }
    }
    if (errorMsg) title = errorMsg

    return { message: title, isWarning: errorMsg !== '' }
  }

  public render() {
    const title = this.getTitle()
    if (this.state.requestTask === undefined || !title) return null

    return (
      <React.Fragment>
        {this.state.requestTask.txHash ? (
          <a
            href={`${TorqueProvider.Instance.web3ProviderSettings!.etherscanURL}tx/${this.state.requestTask.txHash
              }`}
            target="_blank"
            rel="noopener noreferrer">
            <Loader {...this.props} title={title.message} isWarningTitle={title.isWarning} />
          </a>
        ) : (
          <Loader {...this.props} title={title.message} isWarningTitle={title.isWarning} />
        )}
      </React.Fragment>
    )
  }

  public onTasksQueueChanged = () => {
    const tasks = TasksQueue.Instance.getTasksList().find((t) => t.request.id === this.props.taskId)
    this.setState({
      ...this.state,
      requestTask: tasks,
    })
  }
}
