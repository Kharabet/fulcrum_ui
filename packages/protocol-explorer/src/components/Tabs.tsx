import React from 'react'
import { Tab } from '../domain/Tab'
import { NavService } from '../services/NavService'

interface ITabsProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

const Tabs = (props: ITabsProps) => {
  return (
    <div className="tabs">
      <div
        className={`tabs__item ${props.activeTab === Tab.Stats ? 'active' : ''} `}
        onClick={() => {
          NavService.Instance.History.push(`/`)
          props.setActiveTab(Tab.Stats)
        }}>
        Stats
      </div>
      <div
        className={`tabs__item ${props.activeTab === Tab.Liquidations ? 'active' : ''} `}
        onClick={() => {
          NavService.Instance.History.push(`/liquidations`)
          props.setActiveTab(Tab.Liquidations)
        }}>
        Liquidations
      </div>
    </div>
  )
}

export default React.memo(Tabs)
