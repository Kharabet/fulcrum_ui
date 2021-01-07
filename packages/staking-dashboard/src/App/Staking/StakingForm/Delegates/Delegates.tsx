import { observer } from 'mobx-react'
import React from 'react'
import { ButtonBasic } from 'ui-framework'
import StakingFormVM from '../StakingFormVM'
import TopRepList from './TopRepList'

export function Delegates({ vm }: { vm: StakingFormVM }) {
  return (
    <div className="padded-h-4">
      <h3 className="section-header">Delegates</h3>

      {vm.stakingStore.representatives.currentDelegate && (
        <div>
          Your delegate:
          <img className="photo" src={vm.stakingStore.representatives.currentDelegate.imageSrc} />
          {vm.stakingStore.representatives.currentDelegate.name}
        </div>
      )}

      <ButtonBasic onClick={vm.changeDelegateDialog.toggle}>Change delegate ?</ButtonBasic>

      {vm.changeDelegateDialog.visible && (
        <div>
          <h3 className="section-header">Choose a Delegate</h3>

          <h4>TOP 3</h4>
          <TopRepList vm={vm} />

          <ButtonBasic
            className="button"
            disabled={!vm.canChangeDelegate}
            onClick={vm.changeDelegate}>
            Change delegate
          </ButtonBasic>

          <div className="calculator-row">
            <div className="group-buttons">
              <button className="button" onClick={vm.openFindRepDialog}>
                Search delegates
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default observer(Delegates)
