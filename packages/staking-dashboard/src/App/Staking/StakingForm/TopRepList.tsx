import { observer } from 'mobx-react'
import React from 'react'
import StakingFormVM from './StakingFormVM'
import Representative1 from 'app-images/representative1.png'
import Representative2 from 'app-images/representative2.png'
import Representative3 from 'app-images/representative3.png'
import { ButtonBasic } from 'ui-framework'

const defaultAvatars = [Representative1, Representative2, Representative3]

interface ITopRepList {
  vm: StakingFormVM
}

export function TopRepList({ vm }: ITopRepList) {
  const { selectedRepAddress } = vm
  const { representatives } = vm.stakingStore

  return (
    <div>
      <div
        className={`group-buttons ${
          representatives.delegateAlreadyChosen ? 'selected-delegate' : ''
        }`}>
        {representatives.topRepsList.map((rep, index) => {
          const cssClass = `button button-representative ${
            rep.wallet.toLowerCase() === selectedRepAddress.toLowerCase() ? 'active' : ''
          }`
          const avatar = rep.imageSrc || defaultAvatars[index % 3]
          return (
            <ButtonBasic
              key={rep.wallet}
              className={cssClass}
              // disabled={representatives.delegateAlreadyChosen}
              onClick={vm.set}
              onClickEmit="name-value"
              name="selectedRepAddress"
              value={rep.wallet}>
              <img className="photo" src={avatar} alt={`Representative ${index}`} />
              <span className="name">{rep.name}</span>
            </ButtonBasic>
          )
        })}
      </div>
    </div>
  )
}

export default observer(TopRepList)
