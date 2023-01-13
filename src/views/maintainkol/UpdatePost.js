import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormInput } from '@coreui/react'
import Select from 'react-select'

import { tableField } from './UpdatePost.config'
import { getRequestByUri } from '../../utils/request-marketing'
import { URL, PostStatus, DateMode } from 'src/constants'
import { VerticalTableRow } from 'src/components'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'
import { convertDataToSelectOptions } from '../../utils/GeneralFormInput'

const UpdatePost = () => {
  const [searchParams] = useSearchParams()
  const [postDetail, setPostDetail] = useState(null)
  const [state, setState] = useState({})

  useEffect(() => {
    try {
      let postId = searchParams.get('Id')

      const fetchData = async () => {
        const { message: fetchedDetail } = await getRequestByUri(URL.GET_POST_DETAIL + postId)

        const { uploadDate, deadlineDate } = fetchedDetail
        const convertedUploadDate = uploadDate ? new Date(uploadDate) : null

        const postStatus = PostStatus[getPostStatus(new Date(deadlineDate), convertedUploadDate)]
        const convertedDeadline = convertDate(deadlineDate, DateMode.YYYYMMDD)
        const convertedUpload = uploadDate ? convertDate(deadlineDate, DateMode.YYYYMMDD) : null

        setPostDetail({
          ...fetchedDetail,
          postStatus,
          deadlineDate: convertedDeadline,
          uploadDate: convertedUpload,
        })
      }

      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const onFormChange = (e) => {
    const { name, value, checked, type } = e.target
    const newVal = type === 'checkbox' ? checked : value
    console.log('ini newVal', newVal)

    setState({
      ...state,
      [name]: newVal,
    })
  }

  const renderForm = (fields, data) => {
    const info = fields.map((item) => {
      return renderFormField(item, data)
    })

    return info
  }

  const renderFormField = (labelProps, data) => {
    const { label, disabled: isFormDisabled, field, type } = labelProps

    return (
      <CRow className="mb-1">
        <CCol xs={3}>
          <div className="p-2 border bg-light">{label}</div>
        </CCol>
        <CCol xs={9}>
          <CFormInput
            type={type}
            disabled={isFormDisabled}
            name={field}
            value={data[field]}
            onChange={onFormChange}
          />
        </CCol>
      </CRow>
    )
  }

  const renderPageContent = () => {
    return (
      <Suspense>
        <CRow id="post-detail">
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>{'Update Post'} </strong>
              </CCardHeader>
              <CCardBody>{postDetail && renderForm(tableField, postDetail)}</CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </Suspense>
    )
  }

  return <>{renderPageContent()}</>
}

export default UpdatePost
