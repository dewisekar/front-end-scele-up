import React, { useState, useEffect, Suspense } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { NavLink } from 'react-router-dom'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation, NoDataAvailable } from '../../../components'
import { URL } from 'src/constants'
const tableField = [
  { field: 'Name', label: 'Nama Kol' },
  { field: 'Platform', label: 'Platform' },
  { field: 'Sub Media', label: 'Sub Media' },
  { field: 'Username', label: 'Username' },
  { field: 'Kontrak Ke', label: 'Kontrak Ke' },
  { field: 'Booking Slot', label: 'Jumlah Booking Slot' },
  { field: 'managerName', label: 'Manager' },
  { field: 'Masa Kontrak Akhir', label: 'Masa Kontrak Akhir' },
  { field: 'contractStatus', label: 'Status Kontrak' },
  { field: 'action', label: 'Action' },
]

const ListKontrak = () => {
  const [dataTable, setDataTable] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedContract } = await getRequestByUri(URL.GET_CONTRACT_LIST)
      const mappedData = fetchedContract.map((data) => {
        const action = (
          <>
            <NavLink
              to={'/MaintainKol/ViewContract?id=' + data['Kontrak Id']}
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

  const renderTable = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Kontrak</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody style={{ overflowX: 'scroll' }}>
              <DatatablePage data={dataTable} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  const DatatablePage = (props) => {
    let dataInput = {
      columns: tableField,
      rows: props.data,
    }
    return props.data.length > 0 ? (
      <MDBDataTable striped bordered data={dataInput}>
        <MDBTableHead columns={dataInput.columns} />
        <MDBTableBody rows={dataInput.rows} />
      </MDBDataTable>
    ) : (
      <NoDataAvailable />
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderTable()}</>
}

export default ListKontrak
