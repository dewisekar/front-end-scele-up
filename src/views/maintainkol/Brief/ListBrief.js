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
} from '@coreui/react'
import { MDBDataTable } from 'mdbreact'
import { NavLink } from 'react-router-dom'
import Select from 'react-select'

import {
  getRequestByUri,
  getALLKolName,
  execSPWithoutInput,
} from '../../../utils/request-marketing'
import { LoadingAnimation, NoDataAvailable } from 'src/components'
import { URL, StoredProcedure } from 'src/constants'
const tableField = [
  { label: 'Brief Code', field: 'Brief Code' },
  { label: 'Tema', field: 'Tema' },
  { label: 'Konsep', field: 'Konsep' },
  { label: 'Manager Name', field: 'Manager Name' },
  { label: 'Action', field: 'action' },
]
const kolInBriefField = [{ label: 'Nama KOL', field: 'kolName' }]
const broadcastOptions = [
  { value: 'kol', label: 'KOL' },
  { value: 'kolCategory', label: 'Kategori KOL' },
]

const ListBrief = () => {
  const [dataTable, setDataTable] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [choosenBrief, setChoosenBrief] = useState({})
  const [isBroadcastModalShown, setIsBroadcastModalShown] = useState(false)
  const [choosenBroadcastOption, setChoosenBroadcastOption] = useState({
    value: 'kol',
    label: 'KOL',
  })
  const [kolList, setKolList] = useState([])
  const [kolCategoryList, setKolCategoryList] = useState([])
  const [broadcastDestination, setBroadcastDestination] = useState([])
  const [kolInBrief, setKolInBrief] = useState([])
  const [isContentLoading, setIsContentLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedBrief } = await getRequestByUri(URL.GET_BRIEF_LIST)
      const { message: fetchedKol } = await getALLKolName()
      const { message: fetchedCategory } = await execSPWithoutInput(
        StoredProcedure.GET_KOL_CATEGORY,
      )

      const mappedBriefData = fetchedBrief.map((data) => {
        const briefCode = data['Brief Code'] + ' - ' + data['Tema']
        const id = data['Brief Id']
        const briefPayload = { id, briefCode }

        const action = (
          <>
            <NavLink
              to={'/Brief/ViewBrief?id=' + data['Brief Id']}
              className="btn btn-dark btn-sm mb-1"
              style={{ marginRight: '8px' }}
            >
              View
            </NavLink>
            <CButton
              color="secondary"
              onClick={async () => await handleBroadcastModalShow(briefPayload)}
            >
              Broadcast
            </CButton>
          </>
        )
        return { ...data, action }
      })
      const mappedKolData = fetchedKol.map((data) => {
        const { label, ID } = data
        return { label, value: ID }
      })
      const mappedKolCategoryData = fetchedCategory.map((data) => {
        const { category, id } = data
        return { label: category, value: id }
      })

      setDataTable(mappedBriefData)
      setKolList(mappedKolData)
      setKolCategoryList(mappedKolCategoryData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

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
  }

  const renderKolInBriefData = (data) => {
    let dataInput = {
      columns: kolInBriefField,
      rows: data,
    }
    return <MDBDataTable striped bordered data={dataInput}></MDBDataTable>
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
            <CCol lg={6}>
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
                          }}
                        />
                      )}
                    </CCol>
                  </CRow>
                </CRow>
              </CRow>
            </CCol>
            <CCol lg={6}>
              <b>List KOL dengan Brief Ini:</b>
              {renderKolInBriefData(kolInBrief)}
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => handleBroadcastModalClose()}>
            Kirim Broadcast
          </CButton>
          <CButton color="secondary" onClick={() => handleBroadcastModalClose()}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    )
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
              {!isContentLoading && renderDatatable(dataTable)}
            </CCardBody>
          </CCard>
        </CCol>
        {renderModal()}
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
