import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CBadge,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CFormSelect,
} from '@coreui/react'
import {
  execSPWithoutInput,
  execSPWithInput,
  updatePostStatsById,
} from '../../utils/request-marketing'
const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const ViewPost = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [postId, setPostId] = useState(null)
  const [postDetail, setPostDetail] = useState(null)
  const [formatTable, setFormatTable] = useState(null)
  const [postData, setPostData] = useState(null)
  useEffect(() => {
    try {
      let ThisId = searchParams.get('Id')
      setPostId(ThisId)

      //get format
      let Input = { MENU: 'view post' }
      let SPName = '[MARKETING].[dbo].[SP_GetFormatVerticalTable]'
      let resGetFormat = execSPWithInput(SPName, Input)
      resGetFormat.then(function (result) {
        console.log('resGetFormat:', result.status)
        if (result.status === 'true') {
          setFormatTable(result.message)
        }
      })

      let resUpdatePostStatsById = updatePostStatsById(ThisId)
      resUpdatePostStatsById.then(function (result) {
        console.log('resUpdatePostStatsById:', result)
        if (result.status === 'true') {
          //get data
          Input = { Id: ThisId }
          SPName = '[MARKETING].[dbo].[SP_GetPostDetailById]'
          let resGetData = execSPWithInput(SPName, Input)
          resGetData.then(function (resulte) {
            console.log('resGetData:', resulte.status)
            if (resulte.status === 'true') {
              setPostData(resulte.message[0])
            }
          })
        }
      })
    } catch (err) {
      console.log(err)
    }
  }, [])

  const rowData = (item, index) => {
    // console.log('item.label:', item.label)
    // console.log('item.field:', item.field)
    // console.log('postData :', postData)
    // console.log('postData :', postData[item.field])
    return (
      <CRow className="mb-1" key={index}>
        <CCol xs={3}>
          <div className="p-2 border bg-light">{item.label}</div>
        </CCol>
        {postData[item.field] && (
          <CCol xs={9}>
            <div className="p-2 border bg-light">{postData[item.field]}</div>
          </CCol>
        )}
      </CRow>
    )
  }
  return (
    <Suspense fallback={loading}>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>{'View Post'} </strong>
              {/* {postId && <strong>{' Post Id: ' + postId}</strong>} */}
            </CCardHeader>
            <CCardBody>
              {formatTable && postData && formatTable.map((item, index) => rowData(item, index))}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </Suspense>
  )
}

export default ViewPost
