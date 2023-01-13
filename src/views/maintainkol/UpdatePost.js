import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CFormInput, CButton } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'

import { tableField } from './UpdatePost.config'
import { getRequestByUri } from '../../utils/request-marketing'
import { URL, PostStatus, DateMode } from 'src/constants'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'

const UpdatePost = () => {
  const [searchParams] = useSearchParams()
  const [state, setState] = useState({})

  useEffect(() => {
    try {
      let postId = searchParams.get('Id')

      const fetchData = async () => {
        const { message: fetchedDetail } = await getRequestByUri(URL.GET_POST_DETAIL + postId)

        const { uploadDate, deadlineDate, postLink } = fetchedDetail
        const convertedUploadDate = uploadDate ? new Date(uploadDate) : null

        const postStatus = PostStatus[getPostStatus(new Date(deadlineDate), convertedUploadDate)]
        const convertedDeadline = convertDate(deadlineDate, DateMode.YYYYMMDD)
        const convertedUpload = uploadDate ? convertDate(deadlineDate, DateMode.YYYYMMDD) : null
        const isLinkChecked = postLink ? true : false

        setState({
          ...fetchedDetail,
          postStatus,
          deadlineDate: convertedDeadline,
          uploadDate: convertedUpload,
          isLinkChecked,
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
        {field === 'postLink' ? (
          <>
            <CCol xs={6}>
              <CFormInput
                type={type}
                disabled={isFormDisabled}
                name={field}
                value={data[field]}
                onChange={onFormChange}
              />
            </CCol>
            <CCol xs={3} className="d-flex align-items-start justify-content-end">
              <CButton
                color="light"
                className="w-100"
                // onClick={}
              >
                Check Link Validity
              </CButton>
            </CCol>
          </>
        ) : (
          <CCol xs={9}>
            <CFormInput
              type={type}
              disabled={isFormDisabled}
              name={field}
              value={data[field]}
              onChange={onFormChange}
            />
          </CCol>
        )}
      </CRow>
    )
  }

  const renderFormButtons = () => {
    return (
      <>
        <CRow className="mb-1">
          <CCol xs={3}>
            <div className="p-2 border bg-light">Link Belum / Telah Dicek</div>
          </CCol>
          {state.isLinkChecked ? (
            <CCol xs={3}>
              <div className="p-2 border bg-light text-success text-center">
                <b>Link Valid</b> <CIcon icon={cilCheckCircle} size="sm" />
              </div>
            </CCol>
          ) : (
            <CCol xs={3}>
              <div className="p-2 border bg-light text-danger text-center">
                <b>Link Tidak Valid</b> <CIcon icon={cilXCircle} size="sm" />
              </div>
            </CCol>
          )}
        </CRow>
        <CRow className="mt-3">
          <CCol xs={12}>
            <CButton
              color="info"
              className="w-100"
              // onClick={}
            >
              Update
            </CButton>
          </CCol>
        </CRow>
      </>
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
              <CCardBody>
                {state && renderForm(tableField, state)}
                {renderFormButtons()}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </Suspense>
    )
  }

  return <>{renderPageContent()}</>
}

export default UpdatePost
