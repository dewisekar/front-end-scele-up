import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { MDBDataTable } from 'mdbreact'
import { NavLink } from 'react-router-dom'

import { getListKol } from '../../../utils/request-marketing'
import { LoadingAnimation, NoDataAvailable } from 'src/components'
const tableField = [
  { label: 'Name', field: 'Name' },
  { label: 'Username', field: 'Username' },
  { label: 'Platform', field: 'Platform' },
  { label: 'Kategori', field: 'Kategori Kol' },
  { label: 'Jenis', field: 'Jenis' },
  { label: 'Action', field: 'action' },
]

const ListKol = () => {
  const [dataTable, setDataTable] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: fetchedKol = [] } = await getListKol()

        const mappedData = fetchedKol.map((data) => {
          const action = (
            <>
              <NavLink
                to={'/Kol/ViewKol?id=' + data['Kol Id']}
                className="btn btn-dark btn-sm"
                style={{ marginRight: '8px' }}
              >
                View
              </NavLink>
              <NavLink
                to={'/Kol/edit?id=' + data['Kol Id']}
                className="btn btn-dark btn-sm"
                style={{ marginRight: '8px' }}
              >
                Edit
              </NavLink>
            </>
          )
          return { ...data, action }
        })

        setDataTable(mappedData)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
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
              <strong>List Kol</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>
              <DatatablePage data={dataTable} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  const DatatablePage = (props) => {
    if (dataTable !== []) {
      let dataInput = {
        columns: tableField,
        rows: props.data,
      }
      return <MDBDataTable striped bordered data={dataInput}></MDBDataTable>
    }

    return <NoDataAvailable />
  }

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ListKol
