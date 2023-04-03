import React from 'react'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CWidgetStatsC,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import KolInformation from './KolInformation'
import MonthlySlotUsage from './MonthlySlotUsage'
import TotalViewOverview from './TotalViewOverview'
import ViewsByCategory from './ViewsByCategory'

const Dashboard = () => {
  const module = sessionStorage.getItem('level_id')

  const renderMarketingDashboard = () => (
    <>
      <KolInformation />
      <MonthlySlotUsage />
      <TotalViewOverview />
      <ViewsByCategory />
    </>
  )

  return <>{module === 'MKSU' ? renderMarketingDashboard() : <>Coming Soon</>}</>
}

export default Dashboard
