import React, { useState, useEffect } from 'react'
import CIcon from '@coreui/icons-react'
import {
  CFormInput,
  CButton,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CRow,
} from '@coreui/react'
import { cilReload, cilZoom } from '@coreui/icons'
import Select from 'react-select'

import { execSPWithoutInput, getRequestByUri } from '../../../utils/request-marketing'
import {
  StoredProcedure,
  PostStatusOptions,
  FypStatusOptions,
  EndorseTypeOptions,
  URL,
} from 'src/constants'
import { convertDataToSelectOptions } from '../../../utils/GeneralFormInput'

const ListPostFilter = ({ onSearch }) => {
  const [kolCategory, setKolCategory] = useState([])
  const [briefList, setBriefList] = useState([])
  const [managerList, setManagerList] = useState([])
  const intialState = {
    startDate: '',
    endDate: '',
    isFyp: null,
    status: null,
    jenis: null,
    category: null,
    brief: null,
    other: '',
    manager: null,
  }
  const [state, setState] = useState(intialState)

  const onFormChange = (event) => {
    const { name, value, action, label } = event.target
    const newValue =
      action && value
        ? { value: typeof value === 'string' ? value.toLowerCase() : value, label }
        : value

    setState({ ...state, [name]: newValue })
  }

  const onReset = () => {
    setState(intialState)
    onSearch({
      startDate: '',
      endDate: '',
      isFyp: '',
      status: '',
      jenis: '',
      category: '',
      brief: '',
      other: '',
      manager: '',
    })
  }

  const handleSearch = () => {
    let payload = {}
    for (const key in state) {
      const data = state[key] || ''
      const { value } = data
      const newValue = value ? value : data
      payload[key] = typeof newValue === 'string' ? newValue.toLowerCase() : newValue
    }

    if (
      (state.startDate !== '' && state.endDate === '') ||
      (state.startDate === '' && state.endDate !== '')
    ) {
      alert('Silahkan isi tanggal mulai dan akhir. Tanggal mulai dan akhir bisa sama.')
      return
    }
    const startDate = state.startDate !== '' ? new Date(state.startDate).setHours(0, 0, 0, 0) : ''
    const endDate = state.endDate !== '' ? new Date(state.endDate).setHours(0, 0, 0, 0) : ''
    if (endDate < startDate) {
      alert('Tanggal akhir harus sama atau lebih besar dengan tanggal awal')
      return
    }
    onSearch({ ...payload, startDate: startDate, endDate: endDate })
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: fetchedCategory } = await execSPWithoutInput(
          StoredProcedure.GET_KOL_CATEGORY,
        )
        const { message: fetchedBrief } = await getRequestByUri(URL.GET_BRIEF_LIST)
        const { message: fetchedManager } = await getRequestByUri(URL.GET_MANAGER_LIST)
        setKolCategory(convertDataToSelectOptions(fetchedCategory, 'category', 'category'))
        setBriefList(convertDataToSelectOptions(fetchedBrief, 'Brief Code Tema', 'Brief Code Tema'))
        setManagerList(convertDataToSelectOptions(fetchedManager, 'Manager Name', 'Manager Name'))
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [])

  return (
    <CAccordion style={{ width: '100%' }} className="mb-5">
      <CAccordionItem itemKey={1}>
        <CAccordionHeader>Filter</CAccordionHeader>
        <CAccordionBody className="pb-0">
          <div style={{ width: '100%' }} className="mb-4">
            <div className="row">
              <div className="col-md-4">
                <CRow className="text-center">
                  <small>Upload Date</small>
                </CRow>
                <CRow>
                  <div className="col-md-6">
                    <small>Start Date</small>
                    <CFormInput
                      type="date"
                      name="startDate"
                      onChange={onFormChange}
                      value={state.startDate}
                    />
                  </div>
                  <div className="col-md-6">
                    <small>End Date</small>
                    <CFormInput
                      type="date"
                      name="endDate"
                      onChange={onFormChange}
                      value={state.endDate}
                    />
                  </div>
                </CRow>
              </div>
              <div
                className="col-md-3"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
              >
                <small>Status</small>
                <Select
                  placeholder="Status..."
                  isClearable
                  name="status"
                  value={state.status}
                  options={PostStatusOptions}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
              <div
                className="col-md-3"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
              >
                <small>PIC</small>
                <Select
                  placeholder="PIC..."
                  isClearable
                  name="manager"
                  value={state.manager}
                  options={managerList}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
              <div
                className="col-md-2"
                style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}
              >
                <small>FYP Status</small>
                <Select
                  placeholder="FYP Status..."
                  isClearable
                  name="isFyp"
                  value={state.isFyp}
                  options={FypStatusOptions}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-3">
                <small>Jenis</small>
                <Select
                  placeholder="Jenis..."
                  isClearable
                  name="jenis"
                  value={state.jenis}
                  options={EndorseTypeOptions}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
              <div className="col-md-3">
                <small>Kategori</small>
                <Select
                  placeholder="Kategori..."
                  isClearable
                  name="category"
                  options={kolCategory}
                  value={state.category}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
              <div className="col-md-3">
                <small>Brief</small>
                <Select
                  placeholder="Brief..."
                  isClearable
                  name="brief"
                  value={state.brief}
                  options={briefList}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
              <div className="col-md-3">
                <small>Lainnya</small>
                <CFormInput type="text" name="other" onChange={onFormChange} value={state.other} />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <CButton
                  color="primary"
                  className="btn-sm"
                  style={{ marginRight: '10px' }}
                  onClick={handleSearch}
                >
                  <CIcon icon={cilZoom} style={{ marginRight: '5px' }} />
                  Filter
                </CButton>
                <CButton color="dark" className="btn-sm" onClick={onReset}>
                  <CIcon icon={cilReload} style={{ marginRight: '5px' }} />
                  Reset Filter
                </CButton>
              </div>
            </div>
          </div>
        </CAccordionBody>
      </CAccordionItem>
    </CAccordion>
  )
}

export default ListPostFilter
