import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import DataTable from 'react-data-table-component'

import { execSPWithoutInput } from '../../../utils/request-marketing'
import { LoadingAnimation } from 'src/components'
import { tableColumns } from './KolCategory.config'
import { StoredProcedure } from 'src/constants'

const KolCategory = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: fetchedCategory } = await execSPWithoutInput(
          StoredProcedure.GET_KOL_CATEGORY,
        )
        const mappedCategory = fetchedCategory.map((item) => {
          const { id } = item
          const action = (
            <>
              <CButton
                className="btn btn-dark btn-sm"
                style={{ marginRight: '8px', fontSize: '10px' }}
              >
                Edit
              </CButton>
              <CButton className="btn btn-danger btn-sm text-white" style={{ fontSize: '10px' }}>
                Delete
              </CButton>
            </>
          )

          return { ...item, action }
        })

        setData(mappedCategory)
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
              <DataTable
                columns={tableColumns}
                data={data}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                dense
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default KolCategory
