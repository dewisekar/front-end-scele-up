import React from 'react'

import KolInformation from './KolInformation'
import MonthlySlotUsage from './MonthlySlotUsage'
import TotalViewOverview from './TotalViewOverview'
import ViewsByCategory from './ViewsByCategory'
import FypOverview from './FypOverview'

const Dashboard = () => {
  const module = sessionStorage.getItem('level_id')

  const renderMarketingDashboard = () => (
    <>
      <KolInformation />
      <MonthlySlotUsage />
      <TotalViewOverview />
      <ViewsByCategory />
      <FypOverview />
    </>
  )

  return <>{module === 'MKSU' ? renderMarketingDashboard() : <>Coming Soon</>}</>
}

export default Dashboard
