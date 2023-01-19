import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { MDBDataTable } from 'mdbreact'
import { NavLink } from 'react-router-dom'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation, NoDataAvailable } from 'src/components'
import { URL } from 'src/constants'
const tableField = [
  { label: 'Brief Code', field: 'Brief Code' },
  { label: 'Tema', field: 'Tema' },
  { label: 'Konsep', field: 'Konsep' },
  { label: 'Manager Name', field: 'Manager Name' },
  { label: 'Action', field: 'action' },
]

const ListBrief = () => {
  const [dataTable, setDataTable] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedBrief } = await getRequestByUri(URL.GET_BRIEF_LIST)
      const mappedData = fetchedBrief.map((data) => {
        const action = (
          <>
            <NavLink
              to={'/Brief/ViewBrief?id=' + data['Brief Id']}
              className="btn btn-dark btn-sm"
              style={{ marginRight: '8px' }}
            >
              View
            </NavLink>
          </>
        )
        return { ...data, action }
      })
      setDataTable(mappedData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const renderLoadingAnimation = () => {
    return (
      <CRow>
        <LoadingAnimation />
      </CRow>
    )
  }

  const renderContent = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Brief</strong>
            </CCardHeader>
            <CCardBody>{renderDatatable(dataTable)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  const renderDatatable = (data) => {
    if (dataTable !== []) {
      let dataInput = {
        columns: tableField,
        rows: data,
      }
      return <MDBDataTable striped bordered data={dataInput}></MDBDataTable>
    }
    return <NoDataAvailable />
  }

  return <> {isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ListBrief
