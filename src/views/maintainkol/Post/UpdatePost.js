import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormInput,
  CButton,
  CSpinner,
  CFormCheck,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilXCircle } from '@coreui/icons'

import { tableField } from './UpdatePost.config'
import {
  getRequestByUri,
  getVideoAndUserStats,
  patchRequestByUri,
} from '../../../utils/request-marketing'
import { URL, PostStatus, DateMode, PythonErrorCode, ResponseStatus } from 'src/constants'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'
import { ErrorModal, ConfirmationModal } from 'src/components'

const UpdatePost = () => {
  const [searchParams] = useSearchParams()
  const [state, setState] = useState({})
  const [postDetail, setPostDetail] = useState({})
  const [isCheckingPostLink, setIsCheckingPostLink] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false)
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false)
  const [errorModalMessage, setErrorModalMessage] = useState({ title: null, message: null })
  const handleErrorModalClose = () => setIsErrorModalVisible(false)
  const handleErrorModalShow = () => setIsErrorModalVisible(true)
  const handleConfirmationModalClose = () => setIsConfirmationModalVisible(false)
  const handleConfirmationModalShow = () => setIsConfirmationModalVisible(true)
  const errorModalTitle = 'Update Post Error'
  const confirmModalMessage = {
    title: 'Anda yakin ingin update post?',
    message: `Demi kelancaran proses pengambilan statistik post, data yang sudah 
      diupdate post linknya tidak bisa diupdate lagi. Pastikan info yang diinput adalah benar!`,
  }
  let postId = searchParams.get('Id')

  useEffect(() => {
    try {
      const fetchData = async () => {
        const { message: fetchedDetail } = await getRequestByUri(URL.GET_POST_DETAIL + postId)

        const { uploadDate, deadlineDate, postLink, isFyp = 1 } = fetchedDetail
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
          isFyp: isFyp === 1 ? false : true,
        })
        setPostDetail(fetchedDetail)
      }

      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const handleCheckPostLink = async () => {
    const postLink = state.linkPost
    const platform = state.platform

    if (platform !== 'Tiktok') {
      setState({ ...state, isLinkChecked: true })
      return
    }

    setIsCheckingPostLink(true)
    let result = await getVideoAndUserStats(postLink)
    const { status } = result

    if (
      status === PythonErrorCode.NOT_AVAILABLE ||
      status === PythonErrorCode.FAILED_TO_FETCH ||
      status === PythonErrorCode.EMPTY_DATA ||
      postLink === null
    ) {
      setErrorModalMessage({
        message: 'Pastikan anda memasukkan link yang benar',
        title: 'Link Post Tidak Ditemukan',
      })
      handleErrorModalShow()
      setIsCheckingPostLink(false)
      return
    }

    setState({ ...state, isLinkChecked: true })
    setIsCheckingPostLink(false)
  }

  const checkAllFieldsFilled = (fields) => {
    const result = fields.filter((field) => {
      const { field: fieldCode } = field
      return state[fieldCode] === null
    })
    return result
  }

  const onFormSubmit = () => {
    if (state['uploadDate'] === null && state['linkPost'] === null) {
      handleConfirmationModalShow()
      return
    }

    const field = [{ label: 'Link Post', field: 'linkPost', type: 'text', disabled: false }]
    const checker = checkAllFieldsFilled(field)
    const isEveryFieldFilled = checker.length === 0

    if (!isEveryFieldFilled) {
      const [{ label }] = checker
      setErrorModalMessage({ message: 'Mohon isi ' + label, title: errorModalTitle })
      handleErrorModalShow()
      return
    }

    if (state.isLinkChecked && state.uploadDate === null) {
      setErrorModalMessage({ message: 'Mohon isi upload date', title: errorModalTitle })
      handleErrorModalShow()
      return
    }

    if (!state.isLinkChecked) {
      setErrorModalMessage({
        message: 'Please check post link validity!',
        title: errorModalTitle,
      })
      handleErrorModalShow()
      return
    }

    handleConfirmationModalShow()
  }

  const handleSubmitForm = async () => {
    handleConfirmationModalClose()
    const payload = {
      deadlineDate: state.deadlineDate,
      uploadDate: state.uploadDate,
      linkPost: state.linkPost,
      platform: state.platform,
      isFyp: state.isFyp || 1,
    }
    setIsUpdating(true)

    try {
      const { status } = await patchRequestByUri(URL.UPDATE_POST + postId, payload)
      if (status === ResponseStatus.FALSE) {
        setErrorModalMessage({
          message: 'Update post gagal',
          title: 'Update post gagal. Silahkan coba lagi. Post id: ' + postId,
        })
        handleErrorModalShow()
        setIsUpdating(false)
        return
      }

      setErrorModalMessage({
        message: 'Update post berhasil',
        title: 'Update post berhasil. Post id: ' + postId,
      })
      setState({ ...state, postStatus: PostStatus.FULFILLED })
      setIsUpdating(false)
      handleErrorModalShow()
    } catch (error) {
      alert(error)
    }
  }

  const onFormChange = (e) => {
    const { name, value, checked, type } = e.target
    const ValueChecked = {
      true: 2,
      false: 1,
    }
    const newVal = type === 'checkbox' ? ValueChecked[checked] : value

    setState({
      ...state,
      [name]: newVal,
    })
  }

  const renderInput = (labelProps, data) => {
    const { disabled: isFormDisabled, field, type, label } = labelProps

    const Input = {
      date: (
        <CFormInput
          type={type}
          disabled={isFormDisabled}
          name={field}
          value={data[field]}
          onChange={onFormChange}
        />
      ),
      text: (
        <CFormInput
          type={type}
          disabled={isFormDisabled}
          name={field}
          value={data[field]}
          onChange={onFormChange}
        />
      ),
      checkbox: (
        <CFormCheck
          type="checkbox"
          name={field}
          id="gridCheck"
          label={label}
          onChange={onFormChange}
          defaultChecked={data[field]}
        />
      ),
    }

    return Input[type]
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
        {field === 'linkPost' ? (
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
              {!isCheckingPostLink ? (
                <CButton color="light" className="w-100" onClick={handleCheckPostLink}>
                  Check Link Validity
                </CButton>
              ) : (
                <CSpinner color="primary" />
              )}
            </CCol>
          </>
        ) : (
          <CCol xs={9}>{renderInput(labelProps, data)}</CCol>
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
          {state.isLinkChecked || (!state.isLinkChecked && postDetail.uploadDate) ? (
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
          <CCol xs={12} className="text-center">
            {!isUpdating ? (
              <CButton color="info" className="w-100" onClick={onFormSubmit} active>
                Update
              </CButton>
            ) : (
              <CSpinner color="primary" />
            )}
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
                <ErrorModal
                  isVisible={isErrorModalVisible}
                  onClose={handleErrorModalClose}
                  modalMessage={errorModalMessage}
                />
                <ConfirmationModal
                  isVisible={isConfirmationModalVisible}
                  onClose={handleConfirmationModalClose}
                  modalMessage={confirmModalMessage}
                  onConfirm={handleSubmitForm}
                  confirmButtonLabel="Ya, Update"
                />
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
