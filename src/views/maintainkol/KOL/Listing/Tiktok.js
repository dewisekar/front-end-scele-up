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
  CAlert,
  CBadge,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'
import { cilSearch } from '@coreui/icons'

import { getRequestByUri, patchRequestByUri } from '../../../../utils/request-marketing'
import { LoadingAnimation, MultiplePropertyFilter, TextInput, ErrorModal } from 'src/components'
import { formFields, tableField, customSort, StatusEnum } from './Tiktok.config'
import { getCpmStatus } from 'src/utils/pageUtil'
import { CpmEnum, URL } from 'src/constants'
import './Listing.css'
import { handleGetKolCpm, convertData } from './Tiktok.handlers'

const KolListingTiktok = () => {
  const [kolList, setKolList] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAlertModalShown, setIsAlertModalShown] = useState(false)
  const [modalMessage, setModalMessage] = useState({ title: '', message: '' })
  const [resetPaginationToggle, setResetPaginationToggle] = useState(true)
  const [filterText, setFilterText] = useState({ other: '' })
  const isWithTime = false
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm()

  const approveListing = async (id, status) => {
    setIsLoading(true)
    const payload = { status }
    await patchRequestByUri(URL.APPROVE_LISTING_TIKTOK + id, payload)
    await refetchData()
    setIsLoading(false)
  }

  const renderActionButton = (id) => {
    return (
      <>
        <CButton
          className="my-1 btn-secondary btn-sm"
          style={{ marginRight: '8px', fontSize: '10px' }}
          onClick={() => approveListing(id, 'APPROVED')}
        >
          Approve
        </CButton>
        <CButton
          className="btn btn-danger btn-sm"
          style={{ fontSize: '10px' }}
          onClick={() => approveListing(id, 'REJECTED')}
        >
          Reject
        </CButton>
      </>
    )
  }

  const refetchData = async () => {
    const { message: fetchedListing } = await getRequestByUri('/tiktok/fetch-listing')
    const firstConvertedData = convertData(fetchedListing)
    const finalConvertedData = firstConvertedData.map((item) => {
      const { avgCpm, totalViews, status: rawStatus = 'PENDING', id } = item
      const status = rawStatus === null ? 'PENDING' : rawStatus
      return {
        ...item,
        avgCpm: (
          <CBadge color="primary" className="ms-2">
            {avgCpm}
          </CBadge>
        ),
        totalViews: (
          <CBadge color="primary" className="ms-2">
            {totalViews}
          </CBadge>
        ),
        realStatus: status,
        status: (
          <CBadge color={StatusEnum[status]} className="ms-2">
            {status}
          </CBadge>
        ),
        action: status === 'PENDING' && renderActionButton(id),
      }
    })

    setKolList(finalConvertedData)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: fetchedListing } = await getRequestByUri('/tiktok/fetch-listing')
        const firstConvertedData = convertData(fetchedListing)
        const finalConvertedData = firstConvertedData.map((item) => {
          const { avgCpm, totalViews, realAvgCpm, status: rawStatus = 'PENDING', id } = item
          const status = rawStatus === null ? 'PENDING' : rawStatus
          const cpmStatus = getCpmStatus(realAvgCpm)

          return {
            ...item,
            avgCpm: (
              <CBadge color={CpmEnum[cpmStatus]} className="ms-2">
                {avgCpm}
              </CBadge>
            ),
            totalViews: (
              <CBadge color="primary" className="ms-2">
                {totalViews}
              </CBadge>
            ),
            realStatus: status,
            status: (
              <CBadge color={StatusEnum[status]} className="ms-2">
                {status}
              </CBadge>
            ),
            action: status === 'PENDING' && renderActionButton(id),
          }
        })

        setKolList(finalConvertedData)
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

  const onGetCpm = async (data) => {
    const handlers = { setIsAlertModalShown, setModalMessage }
    setIsLoading(true)

    const status = await handleGetKolCpm(data, handlers)

    if (status) {
      setFilterText({ other: '' })
      setResetPaginationToggle(!resetPaginationToggle)
      await refetchData()
    }

    setIsLoading(false)
  }

  const onFilter = (data) => {
    const { other = '' } = data
    setFilterText({ other })
    setResetPaginationToggle(!resetPaginationToggle)
  }

  const filteredKol = kolList.filter((item) => {
    const { username } = item
    return username.toLowerCase().includes(filterText.other)
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
                <CButton
                  color="light"
                  className="w-100"
                  onClick={handleSubmit(onGetCpm)}
                  disabled={isLoading}
                >
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
        columns={tableField}
        data={filteredKol}
        pagination
        paginationRowsPerPageOptions={[10, 25, 50, 100]}
        paginationResetDefaultPage={resetPaginationToggle}
        dense
        sortFunction={customSort}
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
              <CAlert color="info" className="text-center pt-2 pb-2">
                Data diambil dari 10 post terakhir KOL
              </CAlert>
              {renderForm()}
              {isLoading ? renderLoadingAnimation() : renderTable()}
            </CCardBody>
          </CCard>
        </CCol>
        <ErrorModal
          isVisible={isAlertModalShown}
          onClose={() => setIsAlertModalShown(false)}
          modalMessage={modalMessage}
        />
      </CRow>
    )
  }

  return <>{renderContent()}</>
}

export default KolListingTiktok
