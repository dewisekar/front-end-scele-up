import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CSpinner, CAlert } from '@coreui/react'
import { MDBDataTable } from 'mdbreact'
import 'react-datepicker/dist/react-datepicker.css'
import Select from 'react-select'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'
import { URL, PostStatisticKey } from 'src/constants'
import { convertDate } from 'src/utils/pageUtil'
import { countPostStatistic } from 'src/utils/postUtil'
import { RupiahCurrency } from 'src/components'

const tableField = [
  {
    field: 'contractName',
    label: 'Nama KOL - No. Kontrak',
  },
  {
    field: 'username',
    label: 'Username',
  },
  {
    field: 'uploadDate',
    label: 'Tanggal Upload',
  },
  {
    field: 'linkPost',
    label: 'Link Post',
  },
  {
    field: 'views',
    label: 'Views',
  },
  {
    field: 'cpm',
    label: 'CPM',
  },
]

const statisticScore = [PostStatisticKey.CPM]

const ViewCpm = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: fetchedManager } = await getRequestByUri(URL.GET_MANAGER_LIST)
        const { message: fetchedOverview } = await getRequestByUri(URL.GET_POST_AND_COST_OVERVIEW)
        const mappedData = fetchedManager.map((data) => {
          return { value: data['Manager Id'], label: data['Manager Name'] }
        })
        setManagerList(mappedData)
        setPostCostOverview(fetchedOverview)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [managerList, setManagerList] = useState([])
  const [dataTable, setDataTable] = useState([])
  const [postCostOverview, setPostCostOverview] = useState({})

  const fetchViewDataHandler = async (value) => {
    setIsContentLoading(true)
    try {
      const { message: fetchedViews } = await getRequestByUri(
        URL.GET_POST_VIEW_BY_MANAGER + value.value,
      )
      const mappedData = fetchedViews.map((data) => {
        const { views } = data
        const statistic = views === 0 ? { cpm: 0 } : countPostStatistic(data, statisticScore)
        const linkPost = (
          <a href={data.linkPost} target="_blank" rel="noreferrer">
            Link Post
          </a>
        )

        return {
          ...data,
          uploadDate: convertDate(new Date(data.uploadDate)),
          ...statistic,
          linkPost,
        }
      })

      setDataTable(mappedData)
      setIsContentLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const renderDatatable = (data) => {
    let dataInput = {
      columns: tableField,
      rows: data,
    }
    return <MDBDataTable striped bordered data={dataInput}></MDBDataTable>
  }

  const renderLoadingAnimation = () => {
    return <LoadingAnimation />
  }

  const renderContent = () => {
    return (
      <Suspense>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Data View & CPM Per Manager</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol lg={4}>
                    <Select
                      placeholder="Select Manager..."
                      styles={{ width: '100% !important' }}
                      options={managerList}
                      onChange={fetchViewDataHandler}
                    />
                  </CCol>
                  <CCol lg={6}>
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
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardBody>
                <CAlert color="info">
                  Data yang ditampilkan adalah statistik post pada H+7 tanggal upload
                </CAlert>
                {isContentLoading && (
                  <CRow className="text-center">
                    <CCol>
                      <CSpinner color="primary" />
                    </CCol>
                  </CRow>
                )}
                {!isContentLoading && dataTable !== [] && renderDatatable(dataTable)}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </Suspense>
    )
  }
  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ViewCpm
