import React, { useState, useEffect, useMemo } from 'react'
import {
  CBadge,
  CFormInput,
  CButton,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react'
import { NavLink } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'
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
  const [state, setState] = useState({})

  const onFormChange = (event) => {
    console.log('ini state', state, event)
    const { name, value = '', checked, type } = event.target
    const newValue = type === 'checkbox' ? checked : value
    console.log('ini name vale', name, newValue)

    setState({ ...state, [name]: newValue.toLowerCase() })
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
              <div className="col-md-3">
                <small>Deadline Post</small>
                <CFormInput type="date" name="deadlinePost" onChange={onFormChange} />
              </div>
              <div className="col-md-3">
                <small>Status</small>
                <Select
                  placeholder="Status..."
                  isClearable
                  name="status"
                  options={PostStatusOptions}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
              <div className="col-md-3">
                <small>PIC</small>
                <Select
                  placeholder="PIC..."
                  isClearable
                  name="manager"
                  options={managerList}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
              <div className="col-md-3">
                <small>FYP Status</small>
                <Select
                  placeholder="FYP Status..."
                  isClearable
                  name="isFyp"
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
                  options={briefList}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
              <div className="col-md-3">
                <small>Lainnya</small>
                <CFormInput type="text" name="other" onChange={onFormChange} />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-3">
                <CButton
                  color="primary"
                  className="btn-sm"
                  style={{ marginRight: '10px' }}
                  onClick={() => onSearch(state)}
                >
                  Filter
                </CButton>
                <CButton color="dark" className="btn-sm">
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
