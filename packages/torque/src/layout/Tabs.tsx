import React from 'react'
import { Tab } from '../domain/Tab'

interface ITabsProps {
  activeTab: Tab
  setActiveTab: (tab: Tab) => void
}

const Tabs = (props: ITabsProps) => {
  return (
    <div className="tabs">
      <div
        className={`tabs__item ${props.activeTab === Tab.Borrow ? 'active' : ''} `}
        onClick={() => {
          props.setActiveTab(Tab.Borrow)
        }}>
        Borrow
      </div>
      <div
        className={`tabs__item ${props.activeTab === Tab.Loans ? 'active' : ''} `}
        onClick={() => {
          props.setActiveTab(Tab.Loans)
        }}>
        Your loans
      </div>
    </div>
  )
}

export default React.memo(Tabs)
