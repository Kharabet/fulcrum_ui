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
        className={`tabs__item ${props.activeTab === Tab.Borrow ? 'active' : ''} `}
        onClick={() => {
          NavService.Instance.History.push('/')
          props.setActiveTab(Tab.Borrow)
        }}>
        Borrow
      </div>
      <div
        className={`tabs__item ${props.activeTab === Tab.Loans ? 'active' : ''} `}
        onClick={() => {
          NavService.Instance.History.push('/dashboard')
          props.setActiveTab(Tab.Loans)
        }}>
        Your loans
      </div>
    </div>
  )
}

export default React.memo(Tabs)
