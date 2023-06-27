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
import { cilZoom } from '@coreui/icons'
import Select from 'react-select'

import { execSPWithoutInput, getRequestByUri } from '../../../utils/request-marketing'
import { StoredProcedure, EndorseTypeOptions, URL } from 'src/constants'
import { convertDataToSelectOptions } from '../../../utils/GeneralFormInput'

const UpdatePostStatistic = ({ onSearch }) => {
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
    <CAccordion style={{ width: '100%' }} className="mb-3">
      <CAccordionItem itemKey={1}>
        <CAccordionHeader>{`Update Post Statistic`}</CAccordionHeader>
        <CAccordionBody className="pb-0">
          <div style={{ width: '100%' }} className="mb-4">
            <b>
              Hanya gunakan jika lewat dari data hari H, data tidak secara automatis didapatkan
              dengan benar!
            </b>
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
              </div>
            </div>
          </div>
        </CAccordionBody>
      </CAccordionItem>
    </CAccordion>
  )
}

export default UpdatePostStatistic
