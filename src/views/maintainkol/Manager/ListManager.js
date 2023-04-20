import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import DataTable from 'react-data-table-component'
import { NavLink } from 'react-router-dom'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation, MultiplePropertyFilter } from 'src/components'
import { columns } from './ListManager.config'
import { URL } from 'src/constants'

const ListManager = () => {
  const [managerList, setManagerList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterText, setFilterText] = useState({ other: '' })
  const [resetPaginationToggle, setResetPaginationToggle] = useState(true)
  const isWithTime = false

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: fetchedManager = [] } = await getRequestByUri(URL.GET_MANAGER_LIST)
        const mappedData = fetchedManager.map((item) => {
          const { EMAIL: email, ALIAS: alias } = item
          const action = (
            <>
              <NavLink
                to={'/Manager/edit?id=' + item['Manager Id']}
                className="btn btn-dark btn-sm"
                style={{ marginRight: '8px', fontSize: '10px' }}
              >
                Edit
              </NavLink>
              <CButton
                className="btn btn-dark btn-sm"
                style={{ marginRight: '8px', fontSize: '10px' }}
              >
                Delete
              </CButton>
            </>
          )
          return {
            name: item['Manager Name'],
            phone: item['Phone Number'],
            email,
            alias,
            action,
          }
        })

        setManagerList(mappedData)
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

  const onFilter = (data) => {
    const { other = '' } = data
    setFilterText({ other })
    setResetPaginationToggle(!resetPaginationToggle)
  }

  const filteredManager = managerList.filter((item) => {
    return Object.keys(item).some((key) =>
      item[key].toLowerCase().includes(filterText.other.toLowerCase()),
    )
  })

  const renderTable = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Manager</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>
              <MultiplePropertyFilter
                title="Filter Manager"
                fields={[]}
                isWithTime={isWithTime}
                onSubmit={onFilter}
              />
              <DataTable
                columns={columns}
                data={filteredManager}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationResetDefaultPage={resetPaginationToggle}
                dense
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderTable()}</>
}

export default ListManager
