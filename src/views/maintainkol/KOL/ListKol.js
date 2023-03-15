import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'
import { NavLink } from 'react-router-dom'
import DataTable from 'react-data-table-component'

import { getListKol, execSPWithoutInput } from '../../../utils/request-marketing'
import { convertDataToSelectOptions } from 'src/utils/GeneralFormInput'
import { LoadingAnimation, MultiplePropertyFilter } from 'src/components'
import { tableColumns, platformOptions, typeOptions } from './ListKol.config'
import { StoredProcedure } from 'src/constants'

const ListKol = () => {
  const [dataTable, setDataTable] = useState([])
  const [kolCategoryList, setKolCategoryList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(true)
  const [filterText, setFilterText] = useState({ platform: '', type: '', category: '', other: '' })
  const isWithTime = false

  const filterFields = [
    {
      name: 'platform',
      formType: 'select',
      placeholder: 'Platform...',
      options: platformOptions,
    },
    {
      name: 'type',
      formType: 'select',
      placeholder: 'Jenis...',
      options: typeOptions,
    },
    {
      name: 'category',
      formType: 'select',
      placeholder: 'Kategori...',
      options: kolCategoryList,
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: fetchedKol = [] } = await getListKol()
        const { message: fetchedCategory } = await execSPWithoutInput(
          StoredProcedure.GET_KOL_CATEGORY,
        )

        const mappedData = fetchedKol.map((data) => {
          const { Name, Username, Platform, Jenis } = data
          const action = (
            <>
              <NavLink
                to={'/Kol/ViewKol?id=' + data['Kol Id']}
                className="btn btn-dark btn-sm"
                style={{ marginRight: '8px', fontSize: '10px' }}
              >
                View
              </NavLink>
              <NavLink
                to={'/Kol/edit?id=' + data['Kol Id']}
                className="btn btn-dark btn-sm"
                style={{ marginRight: '8px', fontSize: '10px' }}
              >
                Edit
              </NavLink>
            </>
          )
          return {
            action,
            name: Name,
            username: Username,
            platform: Platform,
            type: Jenis,
            category: data['Kategori Kol'],
          }
        })
        const mappedCategory = convertDataToSelectOptions(fetchedCategory, 'category', 'category')

        setKolCategoryList(mappedCategory)
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

  const onFilter = (data) => {
    const { platform = '', type = '', category = '', other = '' } = data
    setFilterText({ platform, type, category, other })
    setResetPaginationToggle(!resetPaginationToggle)
  }

  const filteredKol = dataTable.filter((item) => {
    const { platform, type, category, username, name } = item
    const otherItem = { username, name }
    return Object.keys(otherItem).some(
      (key) =>
        otherItem[key].toLowerCase().includes(filterText.other.toLowerCase()) &&
        platform.toLowerCase().includes(filterText.platform) &&
        type.toLowerCase().includes(filterText.type) &&
        category.toLowerCase().includes(filterText.category),
    )
  })

  const renderContent = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Kol</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>
              <MultiplePropertyFilter
                title="Filter KOL"
                fields={filterFields}
                isWithTime={isWithTime}
                onSubmit={onFilter}
              />
              <DataTable
                columns={tableColumns}
                data={filteredKol}
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

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ListKol
