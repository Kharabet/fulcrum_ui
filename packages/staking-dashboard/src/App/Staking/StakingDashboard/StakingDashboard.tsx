import React from 'react'
import StakingForm from './StakingForm'

export function StakingDashboard() {
  return (
    <section className="pb-50">
      <StakingForm />
    </section>
  )
}

export default React.memo(StakingDashboard)
