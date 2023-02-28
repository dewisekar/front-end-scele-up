import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAlert, CSpinner } from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import { MDBDataTable } from 'mdbreact'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'
import { URL } from 'src/constants'
import { roundScore } from 'src/utils/postUtil'
import { NumberFormat, RupiahCurrency } from 'src/components'

const OverviewTableField = [
  {
    field: 'yearMonth',
    label: 'Bulan - Tahun',
  },
  {
    field: 'kolMaxViews',
    label: 'KOL Dengan Views Tertinggi',
  },
  {
    field: 'maxViews',
    label: 'Views',
  },
  {
    field: 'kolMaxCpm',
    label: 'KOL Dengan CPM Tertinggi',
  },
  {
    field: 'maxCpm',
    label: 'CPM',
  },
]

const MonthlyOverview = () => {
  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedOverview } = await getRequestByUri(URL.GET_POST_AND_COST_OVERVIEW)
      const { message: fetchedMonthlyOverview } = await getRequestByUri(URL.GET_MONTHLY_OVERVIEW)
      const modifiedOverview = fetchedMonthlyOverview.map((data) => {
        const { maxViews, maxCpm } = data
        return {
          ...data,
          maxViews: <NumberFormat number={roundScore(maxViews)} />,
          maxCpm: new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
          }).format(maxCpm),
        }
      })
      setPostCostOverview(fetchedOverview)
      setMonthlyOverview(modifiedOverview)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [isContentLoading, setIsContentLoading] = useState(false)

  const [postCostOverview, setPostCostOverview] = useState({})
  const [monthlyOverview, setMonthlyOverview] = useState([])

  const renderLoadingAnimation = () => {
    return <LoadingAnimation />
  }

  const renderDatatable = (data) => {
    let dataInput = {
      columns: OverviewTableField,
      rows: data,
    }
    return <MDBDataTable striped bordered data={dataInput}></MDBDataTable>
  }

  const renderContent = () => {
    return (
      <Suspense>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Monthly Overview</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol lg={12} className="text-center">
                    Total Budget - Cost:{' '}
                    <RupiahCurrency balance={postCostOverview.totalCostData.cost} /> | Slot:{' '}
                    {postCostOverview.totalCostData.slot} <br></br>
                    Uploaded Budget - Cost:{' '}
                    <RupiahCurrency balance={postCostOverview.spentCostData.cost} /> | Slot:{' '}
                    {postCostOverview.spentCostData.slot} <br></br>
                    Remaining Budget - Cost:{' '}
                    <RupiahCurrency balance={postCostOverview.remainingCostData.cost} /> | Slot:{' '}
                    {postCostOverview.remainingCostData.slot}
                  </CCol>
                </CRow>

                <CRow>
                  <CCol lg={12}>{renderDatatable(monthlyOverview)}</CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </Suspense>
    )
  }
  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default MonthlyOverview
