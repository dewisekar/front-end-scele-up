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
import { cilSave } from '@coreui/icons'
import Select from 'react-select'

import { postRequestByUri } from '../../../utils/request-marketing'
import { URL } from 'src/constants'
import { convertDataToSelectOptions } from '../../../utils/GeneralFormInput'

const UpdatePostStatistic = ({ handlers, postId, uploadDate }) => {
  const { setIsLoading, setAlertMessage, setIsAlertModalShown, setIsReload } = handlers
  const dayNumberOptions = [
    { value: 1, label: 1 },
    { value: 7, label: 7 },
    { value: 14, label: 14 },
    { value: 28, label: 28 },
  ]
  const intialState = {
    dayNumber: null,
    followers: null,
    views: null,
    likes: null,
    shares: null,
    comments: null,
  }
  const [state, setState] = useState(intialState)
  const today = new Date()
  const convertedUploadDate = new Date(uploadDate)
  const timeDifference = Math.abs(today - convertedUploadDate)
  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))

  const onFormChange = (event) => {
    const { name, value, action, label } = event.target
    const newValue =
      action && value
        ? { value: typeof value === 'string' ? value.toLowerCase() : value, label }
        : value

    setState({ ...state, [name]: newValue })
  }

  const handleUpdate = async () => {
    console.log('ini state', state)
    const hasNull = Object.keys(state).some((key) => state[key] === null || state[key] === '')

    if (uploadDate === null) {
      setIsReload(false)
      setAlertMessage({
        title: 'Error',
        message: 'Tidak dapat menambah statisik karena tidak mempunyai tanggal upload',
      })
      setIsAlertModalShown(true)
      return
    }

    if (hasNull) {
      setIsReload(false)
      setAlertMessage({ title: 'Error', message: 'Harap isi semua field' })
      setIsAlertModalShown(true)
      return
    }

    const {
      dayNumber: { value },
    } = state
    console.log(dayDifference, value)

    if (dayDifference < value) {
      setIsReload(false)
      setAlertMessage({
        title: 'Error',
        message:
          'Tidak bisa menambah statistik. Harap menunggu ketika jumlah perbedaan hari lebih besar',
      })
      setIsAlertModalShown(true)
      return
    }

    const payload = { ...state, dayNumber: value, postId }
    setIsLoading(true)
    const { status, message } = await postRequestByUri('/post-statistic', payload)
    setIsReload(true)
    if (status === 'false') {
      setIsReload(false)
    }
    setAlertMessage({ title: 'Update post statistic', message })
    setIsLoading(false)
    setIsAlertModalShown(true)
  }

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
              <div className="col-md-4">
                <small>Hari Ke-</small>
                <Select
                  placeholder="Hari Ke..."
                  isClearable
                  name="dayNumber"
                  value={state.dayNumber}
                  options={dayNumberOptions}
                  onChange={(value, action) => {
                    onFormChange({ target: { ...value, ...action } })
                  }}
                />
              </div>
              <div className="col-md-4">
                <small>Followers</small>
                <CFormInput
                  type="text"
                  name="followers"
                  onChange={onFormChange}
                  value={state.followers}
                />
              </div>
              <div className="col-md-4">
                <small>Views</small>
                <CFormInput type="text" name="views" onChange={onFormChange} value={state.views} />
              </div>
            </div>
            <div className="row mt-2">
              <div className="col-md-4">
                <small>Likes</small>
                <CFormInput type="text" name="likes" onChange={onFormChange} value={state.likes} />
              </div>
              <div className="col-md-4">
                <small>Shares</small>
                <CFormInput
                  type="text"
                  name="shares"
                  onChange={onFormChange}
                  value={state.shares}
                />
              </div>
              <div className="col-md-4">
                <small>Comments</small>
                <CFormInput
                  type="text"
                  name="comments"
                  onChange={onFormChange}
                  value={state.comments}
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <CButton
                  color="primary"
                  className="btn-sm"
                  style={{ marginRight: '10px' }}
                  onClick={handleUpdate}
                >
                  <CIcon icon={cilSave} style={{ marginRight: '5px' }} />
                  Save
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
