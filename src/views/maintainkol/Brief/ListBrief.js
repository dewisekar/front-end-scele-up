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
const broadcastOptions = [
  { value: 'kol', label: 'KOL' },
  { value: 'kolCategory', label: 'Kategori KOL' },
]

const ListBrief = () => {
  const [dataTable, setDataTable] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalShown, setIsModalShown] = useState(true)
  const [choosenBroadcastOption, setChoosenBroadcastOption] = useState({
    value: 'kol',
    label: 'KOL',
  })
  const handleModalClose = () => setIsModalShown(false)
  const [kolList, setKolList] = useState([])
  const [kolCategoryList, setKolCategoryList] = useState([])
  const [broadcastDestination, setBroadcastDestination] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedBrief } = await getRequestByUri(URL.GET_BRIEF_LIST)
      const { message: fetchedKol } = await getALLKolName()
      const { message: fetchedCategory } = await execSPWithoutInput(
        StoredProcedure.GET_KOL_CATEGORY,
      )
      console.log(fetchedCategory)
      const mappedBriefData = fetchedBrief.map((data) => {
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

  const handleModalShow = () => {
    setIsModalShown(true)
  }

  const renderModal = () => {
    return (
      <CModal
        size="xl"
        alignment="center"
        visible={isModalShown}
        onClose={() => handleModalClose()}
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
                  <CCol>December/22/1 - Re-Create Ombre Blackpink</CCol>
                </CRow>
              </CRow>
              <CRow className="mb-2">
                <CRow>
                  <CCol lg={12} className="mb-1">
                    <b>Pilih Penerima:</b>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol lg={3}>
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
                  <CCol lg={9}>
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
                          console.log(e)
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
                          console.log(e)
                          setBroadcastDestination(e)
                        }}
                      />
                    )}
                  </CCol>
                </CRow>
              </CRow>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => handleModalClose()}>
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
            <CCardBody>{renderDatatable(dataTable)}</CCardBody>
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
