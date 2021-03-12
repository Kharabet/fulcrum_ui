import React, { Component } from 'react'
import { RequestTask } from '../domain/RequestTask'
import { TasksQueueEvents } from '../services/events/TasksQueueEvents'
import { TasksQueue } from '../services/TasksQueue'
import { FulcrumProvider } from '../services/FulcrumProvider'

export interface ILendTxLoaderStepProps {
  taskId: number
}

export interface ILendTxLoaderStepState {
  requestTask: RequestTask | undefined
}

export class LendTxLoaderStep extends Component<ILendTxLoaderStepProps, ILendTxLoaderStepState> {
  constructor(props: ILendTxLoaderStepProps) {
    super(props)

    this.state = {
      requestTask: TasksQueue.Instance.getTasksList().find(
        (t) => t.request.id === this.props.taskId
      ),
    }

    TasksQueue.Instance.on(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged)
    TasksQueue.Instance.on(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged)
    this.stepDiv = React.createRef()
    this._isMounted = false
  }

  private _isMounted: boolean

  private stepDiv: React.RefObject<HTMLDivElement>

  public componentDidMount(): void {
    this._isMounted = true

    const div = this.stepDiv.current
    if (!div) return
    div.classList.remove('animation-in')
    div.classList.add('animation-in')
  }

  public componentDidUpdate(
    prevProps: Readonly<ILendTxLoaderStepProps>,
    prevState: Readonly<ILendTxLoaderStepState>
  ): void {
    const div = this.stepDiv.current
    if (!div) return
    if (
      prevState.requestTask &&
      this.state.requestTask &&
      this.getTitle(prevState.requestTask) === this.getTitle(this.state.requestTask)
    )
      return
    div.classList.remove('animation-out')
    div.classList.remove('animation-in')
    div.classList.add('animation-in')
  }

  public componentWillUnmount(): void {
    this._isMounted = false

    const div = this.stepDiv.current
    if (div) {
      div.classList.remove('animation-out')
      div.classList.add('animation-out')
    }

    TasksQueue.Instance.off(TasksQueueEvents.QueueChanged, this.onTasksQueueChanged)
    TasksQueue.Instance.off(TasksQueueEvents.TaskChanged, this.onTasksQueueChanged)
  }

  public getTitle = (requestTask: RequestTask) => {
    if (requestTask === undefined) return null
    let title = requestTask.steps.find((s, i) => i + 1 === requestTask!.stepCurrent)
    if (!title) title = requestTask.status

    let errorMsg = ''
    if (requestTask.error) {
      if (requestTask.error.message) {
        errorMsg = requestTask.error.message
      } else if (typeof requestTask.error === 'string') {
        errorMsg = requestTask.error
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
          errorMsg = requestTask.status
        }
      }
    }
    if (errorMsg) title = errorMsg

    return { message: title, isWarning: errorMsg !== '' }
  }

  public render() {
    if (this.state.requestTask === undefined) return null

    const title = this.getTitle(this.state.requestTask)
    if (!title) return null
    return this.state.requestTask && this.state.requestTask.txHash ? (
      <a
        href={`${FulcrumProvider.Instance.web3ProviderSettings!.etherscanURL}tx/${
          this.state.requestTask!.txHash
        }`}
        target="_blank"
        rel="noopener noreferrer">
        <div
          ref={this.stepDiv}
          className={`lend-transaction-step ${title.isWarning ? 'warning' : ''}`}>
          {title.message}
        </div>
      </a>
    ) : (
      <div
        ref={this.stepDiv}
        className={`lend-transaction-step ${title.isWarning ? 'warning' : ''}`}>
        {title.message}
      </div>
    )
  }

  public onTasksQueueChanged = async () => {
    const task = TasksQueue.Instance.getTasksList().find((t) => t.request.id === this.props.taskId)
    const div = this.stepDiv.current
    if (
      div &&
      task &&
      this.state.requestTask &&
      this.getTitle(task) !== this.getTitle(this.state.requestTask)
    ) {
      div.classList.remove('animation-in')
      div.classList.remove('animation-out')
      div.classList.add('animation-out')
    }
    window.setTimeout(async () => {
      ;(await this._isMounted) &&
        this.setState({
          ...this.state,
          requestTask: task,
        })
    }, 500)
  }
}
