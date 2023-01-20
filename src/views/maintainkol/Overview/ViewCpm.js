import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormSelect, CAlert } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import 'react-datepicker/dist/react-datepicker.css'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'
import { URL, PostStatisticKey } from 'src/constants'
import { convertDate } from 'src/utils/pageUtil'
import { countPostStatistic } from 'src/utils/postUtil'

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
        const mappedData = fetchedManager.map((data) => {
          return { Id: data['Manager Id'], label: data['Manager Name'] }
        })
        setManagerList(mappedData)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  const [isLoading, setIsLoading] = useState(true)
  const [managerList, setManagerList] = useState([])
  const [dataTable, setDataTable] = useState([])

  const fetchViewDataHandler = async (value) => {
    setIsLoading(true)
    try {
      const { message: fetchedViews } = await getRequestByUri(
        URL.GET_POST_VIEW_BY_MANAGER + value.Id,
      )
      const mappedData = fetchedViews.map((data) => {
        const statistic = countPostStatistic(data, statisticScore)
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
      setIsLoading(false)
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
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={managerList}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Choose Manager" size="small" />
                  )}
                  onChange={(event, value) => fetchViewDataHandler(value)}
                />
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
                {dataTable !== [] && renderDatatable(dataTable)}
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
