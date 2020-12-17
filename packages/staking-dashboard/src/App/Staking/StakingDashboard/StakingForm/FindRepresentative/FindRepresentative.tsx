import 'simplebar/dist/simplebar.min.css'
import { ReactComponent as CloseIcon } from 'app-images/ic__close.svg'
import { ReactComponent as Search } from 'app-images/icon-search.svg'
import { observer } from 'mobx-react'
import React from 'react'
import SimpleBar from 'simplebar-react'
import { InputBasic } from 'ui-framework'
import StakingFormVM from '../StakingFormVM'
import FindRepresentativeItem from './FindRepresentativeItem'

export function FindRepresentative({ vm }: { vm: StakingFormVM }) {
  return (
    <div className="modal find-representative">
      <div className="modal__title">
        Find a Representative
        <div onClick={vm.closeFindRepDialog}>
          <CloseIcon className="modal__close" />
        </div>
      </div>
      <div>
        <div className="input-wrapper">
          <Search />
          <InputBasic
            placeholder="Search"
            onChange={vm.set}
            onChangeEmit="name-value"
            name="repSearchInput"
            value={vm.repSearchInput}
          />
        </div>
        <div className="header-find-representative">
          <span className="representative">Representative</span>
          <span className="stake">Stake</span>
        </div>
        <ul>
          <SimpleBar style={{ maxHeight: '50vh' }} autoHide={false}>
            {vm.repFilteredList.map((rep) => (
              <FindRepresentativeItem
                key={rep.wallet}
                representative={rep}
                onRepClick={() => vm.selectNonTopRep(rep.wallet)}
              />
            ))}
          </SimpleBar>
        </ul>
      </div>
    </div>
  )
}

export default observer(FindRepresentative)
