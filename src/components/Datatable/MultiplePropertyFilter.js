import React, { useState, useEffect } from 'react'
import Select from 'react-select'
import {
  CFormInput,
  CButton,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
  CAccordion,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch } from '@coreui/icons'

import { MonthsSelectOptions } from 'src/constants'

const MultiplePropertyFilter = ({ onSubmit, fields = [], title }) => {
  const [state, setState] = useState({})

  useEffect(() => {}, [])

  const onFormChange = (event) => {
    const { name, value = '', checked, type } = event.target
    const newValue = type === 'checkbox' ? checked : value

    setState({ ...state, [name]: newValue.toLowerCase() })
  }

  const onClick = () => {
    onSubmit(state)
  }

  const renderSelectCFormInput = (option) => (
    <Select
      options={option.options}
      isClearable
      placeholder={option.placeholder}
      onChange={(value, action) => {
        onFormChange({ target: { ...value, ...action } })
      }}
      name={option.name}
    />
  )

  const renderTextCFormInput = (option) => (
    <CFormInput
      className="border-gray-300"
      placeholder={option.placeholder}
      name={option.name}
      onChange={onFormChange}
    />
  )

  const renderCFormInput = (options) => {
    const { formType } = options

    const RenderCFormInput = {
      select: renderSelectCFormInput(options),
      input: renderTextCFormInput(options),
    }

    return <div className="col-md-2">{RenderCFormInput[formType]}</div>
  }

  return (
    <>
      <CAccordion style={{ width: '100%' }} className="mb-5">
        <CAccordionItem itemKey={1}>
          <CAccordionHeader>{title}</CAccordionHeader>
          <CAccordionBody className="">
            <div className="row">
              {fields.map((item) => renderCFormInput(item))}
              <div className="col-md-2">
                <Select
                  options={MonthsSelectOptions}
                  name="month"
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                  placeholder="Month..."
                  isClearable
                />
              </div>
              <div className="col-md-1">
                <CFormInput
                  className="border-gray-300"
                  placeholder="Year"
                  name="year"
                  onChange={onFormChange}
                />
              </div>
              <div className="col-md-1">
                <CButton onClick={onClick} style={{ display: 'flex', alignItems: 'center' }}>
                  <CIcon icon={cilSearch} className="me-2" /> Search
                </CButton>
              </div>
            </div>
          </CAccordionBody>
        </CAccordionItem>
      </CAccordion>
    </>
  )
}

export default MultiplePropertyFilter
