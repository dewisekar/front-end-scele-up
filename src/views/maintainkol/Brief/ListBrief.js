import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CModal,
  CModalBody,
  CModalTitle,
  CModalHeader,
  CModalFooter,
  CButton,
  CSpinner,
  CTable,
} from '@coreui/react'
import { NavLink } from 'react-router-dom'
import Select from 'react-select'
import DataTable from 'react-data-table-component'

import {
  getRequestByUri,
  execSPWithoutInput,
  postRequestByUri,
} from '../../../utils/request-marketing'
import { LoadingAnimation, MultiplePropertyFilter } from 'src/components'
import { URL, StoredProcedure } from 'src/constants'
import { tableColumns, customSort } from './ListBrief.config'
import { getRupiahString, getNumberFormat } from 'src/utils/pageUtil'
import { convertDataToSelectOptions } from 'src/utils/GeneralFormInput'

const kolInBriefField = [{ label: 'Nama KOL', key: 'kolName' }]
const broadcastOptions = [
  { value: 'kol', label: 'KOL' },
  { value: 'kolCategory', label: 'Kategori KOL' },
]

const ListBrief = () => {
  const [dataTable, setDataTable] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [choosenBrief, setChoosenBrief] = useState({})
  const [isBroadcastModalShown, setIsBroadcastModalShown] = useState(false)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(true)
  const [filterText, setFilterText] = useState({ manager: '', year: '', month: '' })
  const [choosenBroadcastOption, setChoosenBroadcastOption] = useState({
    value: 'kol',
    label: 'KOL',
  })
  const [kolList, setKolList] = useState([])
  const [kolCategoryList, setKolCategoryList] = useState([])
  const [broadcastDestination, setBroadcastDestination] = useState([])
  const [kolInBrief, setKolInBrief] = useState([])
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [managerList, setManagerList] = useState([])
  const [isSendingBroadCast, setIsSendingBroadcast] = useState(false)
  const [isDestinationEmpty, setIsDestinationEmpty] = useState(false)

  const filterConfig = [
    {
      name: 'manager',
      formType: 'select',
      placeholder: 'PIC...',
      options: managerList,
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedBrief = [] } = await getRequestByUri(URL.GET_BRIEF_LIST)
      const { message: fetchedKol = [] } = await getRequestByUri(URL.GET_ACTIVE_KOL)
      const { message: fetchedManager } = await getRequestByUri(URL.GET_MANAGER_LIST)
      const { message: fetchedCategory = [] } = await execSPWithoutInput(
        StoredProcedure.GET_KOL_CATEGORY,
      )

      const mappedBriefData = fetchedBrief.map((data) => {
        const briefCode = data['Brief Code'] + ' - ' + data['Tema']
        const id = data['Brief Id']
        const briefPayload = { id, briefCode }
        const { totalCost, totalViews, totalCpm } = data
        const manager = data['Manager Name']

        const action = (
          <div className="my-1">
            <NavLink
              to={'/Brief/ViewBrief?id=' + data['Brief Id']}
              className="btn btn-dark btn-sm"
              style={{ marginRight: '8px', fontSize: '10px' }}
            >
              View
            </NavLink>
            <CButton
              color="secondary"
              className="btn-sm"
              style={{ fontSize: '10px' }}
              onClick={async () => await handleBroadcastModalShow(briefPayload)}
            >
              Broadcast
            </CButton>
          </div>
        )
        return {
          ...data,
          action,
          totalCost: getRupiahString(totalCost),
          realTotalCost: totalCost,
          totalCpm: getRupiahString(totalCpm),
          realTotalCpm: parseFloat(totalCpm),
          totalViews: getNumberFormat(totalViews),
          realTotalViews: parseFloat(totalViews),
          manager,
        }
      })
      const mappedKolData = fetchedKol.map((data) => {
        const { kolName, kolId } = data
        return { label: kolName, value: kolId }
      })
      const mappedKolCategoryData = fetchedCategory.map((data) => {
        const { category, id } = data
        return { label: category, value: id }
      })

      setManagerList(convertDataToSelectOptions(fetchedManager, 'Manager Name', 'Manager Name'))
      setDataTable(mappedBriefData)
      setKolList(mappedKolData)
      setKolCategoryList(mappedKolCategoryData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const filteredBrief = dataTable.filter((item) => {
    const { yearMonth, manager } = item
    const date = filterText.year + '/' + filterText.month
    return (
      manager.toLowerCase().includes(filterText.manager) && yearMonth.toLowerCase().includes(date)
    )
  })

  const handleBroadcastModalShow = async (payload) => {
    setIsContentLoading(true)
    try {
      const { message: fetchedKol } = await getRequestByUri(
        URL.GET_KOL_LIST_BY_BRIEF_ID + payload.id,
      )

      setKolInBrief(fetchedKol)
      setChoosenBrief(payload)
      setIsBroadcastModalShown(true)
      setIsContentLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  const handleBroadcastModalClose = () => {
    setIsBroadcastModalShown(false)
    setBroadcastDestination([])
  }

  const renderKolInBriefData = (data) => {
    return <CTable className="mt-3" bordered items={data} columns={kolInBriefField}></CTable>
  }

  const handleConfirmBroadcastBrief = async () => {
    if (broadcastDestination.length === 0) {
      setIsDestinationEmpty(true)
      return
    }

    setIsSendingBroadcast(true)
    const destinationIds = broadcastDestination.map((data) => {
      return data.value
    })
    const payload = {
      params: choosenBroadcastOption.value,
      destination: destinationIds,
      briefId: choosenBrief.id,
    }

    try {
      const { status } = await postRequestByUri(URL.BROADCAST_BRIEF, payload)
      setIsSendingBroadcast(false)
      if (status === 'true') {
        alert('Berhasil mengirim broadcast')
        return
      }
      alert('Gagal mengirim broadcast')
    } catch (error) {
      console.log(error)
    }
  }

  const renderModal = () => {
    return (
      <CModal
        size="xl"
        alignment="center"
        visible={isBroadcastModalShown}
        onClose={() => handleBroadcastModalClose()}
      >
        <CModalHeader>
          <CModalTitle>Broadcast Brief</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol lg={8}>
              <CRow className="mb-2">
                <CRow className="mb-1">
                  <CCol>
                    <b>Brief:</b> <br />
                  </CCol>
                </CRow>
                <CRow>
                  <CCol>{choosenBrief.briefCode}</CCol>
                </CRow>
              </CRow>
              <CRow className="mb-2">
                <CRow>
                  <CRow className="mb-2">
                    <CCol lg={12}>
                      <b>Pilihan:</b>
                      <Select
                        options={broadcastOptions}
                        placeholder="Kategori"
                        value={choosenBroadcastOption}
                        onChange={(e) => {
                          setChoosenBroadcastOption(e)
                          setBroadcastDestination([])
                        }}
                      />
                    </CCol>
                  </CRow>
                  <CRow>
                    <CCol lg={12}>
                      <b>Pilih Penerima:</b>
                      {choosenBroadcastOption.value === 'kol' ? (
                        <Select
                          isMulti
                          name="colors"
                          options={kolList}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Pilih KOL"
                          value={broadcastDestination}
                          onChange={(e) => {
                            setBroadcastDestination(e)
                            setIsDestinationEmpty(false)
                          }}
                        />
                      ) : (
                        <Select
                          isMulti
                          name="colors"
                          options={kolCategoryList}
                          className="basic-multi-select"
                          classNamePrefix="select"
                          placeholder="Pilih KOL Kategori"
                          value={broadcastDestination}
                          onChange={(e) => {
                            setBroadcastDestination(e)
                            setIsDestinationEmpty(false)
                          }}
                        />
                      )}
                      {isDestinationEmpty && (
                        <small className="mt-1 text-danger">Harap pilih penerima broadcast!</small>
                      )}
                    </CCol>
                  </CRow>
                </CRow>
              </CRow>
            </CCol>
            <CCol lg={4} style={{ maxHeight: '250px', overflowY: 'scroll' }}>
              <b>List KOL dengan Brief Ini:</b>
              {renderKolInBriefData(kolInBrief)}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter className="d-flex justify-content-center">
          {isSendingBroadCast ? (
            <CSpinner color="primary" />
          ) : (
            <>
              <CButton color="primary" onClick={() => handleConfirmBroadcastBrief()}>
                Kirim Broadcast
              </CButton>
              <CButton color="secondary" onClick={() => handleBroadcastModalClose()}>
                Close
              </CButton>
            </>
          )}
        </CModalFooter>
      </CModal>
    )
  }

  const onFilter = (data) => {
    const { manager = '', year = '', month = '' } = data
    setFilterText({ manager, year, month })
    setResetPaginationToggle(!resetPaginationToggle)
  }

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
            <CCardBody>
              {isContentLoading && (
                <CRow className="text-center">
                  <CCol>
                    <CSpinner color="primary" />
                  </CCol>
                </CRow>
              )}

              {!isContentLoading && renderDatatable()}
            </CCardBody>
          </CCard>
        </CCol>
        {renderModal()}
      </CRow>
    )
  }

  const renderDatatable = () => {
    return (
      <>
        <MultiplePropertyFilter title="Filter Brief" fields={filterConfig} onSubmit={onFilter} />
        <DataTable
          className="mt-3"
          columns={tableColumns}
          data={filteredBrief}
          pagination
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          sortFunction={customSort}
          paginationResetDefaultPage={resetPaginationToggle}
          dense
        />
      </>
    )
  }

  return <> {isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ListBrief
