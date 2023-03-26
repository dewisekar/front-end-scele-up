import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CAccordion,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { NavLink } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { cilSearch } from '@coreui/icons'

import { getListKol, execSPWithoutInput } from '../../../../utils/request-marketing'
import { convertDataToSelectOptions } from 'src/utils/GeneralFormInput'
import { LoadingAnimation, MultiplePropertyFilter, TextInput } from 'src/components'
import { formFields } from './Tiktok.config'

const KolListingTiktok = () => {
  const [dataTable, setDataTable] = useState([])
  const [kolCategoryList, setKolCategoryList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(true)
  const [filterText, setFilterText] = useState({ platform: '', type: '', category: '', other: '' })
  const isWithTime = false
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setKolCategoryList([])
        setDataTable([])
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

  const onGetCpm = (data) => {
    console.log('ini data', data)
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

  const renderFields = () => {
    const input = formFields.map((item) => {
      const formProps = { ...item, register, errors, control }

      return (
        <>
          <CCol xs={6} className="mt-2">
            <TextInput {...formProps} key={item.name} />
          </CCol>
        </>
      )
    })
    return input
  }

  const renderForm = () => (
    <CAccordion style={{ width: '100%' }} className="mb-3">
      <CAccordionItem itemKey={1}>
        <CAccordionHeader>Input Username and Cost per Slot</CAccordionHeader>
        <CAccordionBody className="">
          <form>
            <CRow>{renderFields()}</CRow>
            <CRow className="mt-4">
              <CCol xs={12}>
                <CButton color="light" className="w-100" onClick={handleSubmit(onGetCpm)}>
                  <CIcon icon={cilSearch} className="me-2" /> Get CPM
                </CButton>
              </CCol>
            </CRow>
          </form>
        </CAccordionBody>
      </CAccordionItem>
    </CAccordion>
  )

  const renderTable = () => (
    <>
      <MultiplePropertyFilter
        title="Filter KOL"
        fields={[]}
        isWithTime={isWithTime}
        onSubmit={onFilter}
      />
      <DataTable
        columns={[]}
        data={filteredKol}
        pagination
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        paginationResetDefaultPage={resetPaginationToggle}
        dense
      />
    </>
  )

  const renderContent = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Data Listing KOL Tiktok</strong>
            </CCardHeader>
            <CCardBody>
              {renderForm()}
              {renderTable()}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default KolListingTiktok
