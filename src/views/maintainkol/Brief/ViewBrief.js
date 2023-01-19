import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import { getRequestByUri } from '../../../utils/request-marketing'
import { URL } from 'src/constants'
import { LoadingAnimation, VerticalTable } from 'src/components'

const ViewBrief = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [briefDetail, setBriefDetail] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const briefDetailField = [
    { key: 'briefCode', label: 'Brief Code' },
    { key: 'managerName', label: 'Brief Manager' },
    { key: 'theme', label: 'Tema' },
    { key: 'concept', label: 'Konsep' },
    { key: 'reference', label: 'Link Referensi' },
    { key: 'script', label: 'Script' },
  ]

  useEffect(() => {
    try {
      const fetchData = async () => {
        let id = searchParams.get('id')
        const { message: fetchedDetail } = await getRequestByUri(URL.GET_BRIEF_DETAIL + id)

        setBriefDetail(fetchedDetail)
        setIsLoading(false)
      }

      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const renderBriefDetail = () => {
    return (
      <CRow id="post-detail">
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol md={6}>
                  <strong>{`Detail Brief`}</strong>
                </CCol>
                <CCol md={6} className="d-flex align-items-start justify-content-end"></CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <VerticalTable fields={briefDetailField} data={briefDetail} />
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  const renderLoadingAnimation = () => {
    return <LoadingAnimation />
  }

  const renderPageContent = () => {
    return <Suspense>{renderBriefDetail()}</Suspense>
  }

  return <>{isLoading ? renderLoadingAnimation() : renderPageContent()}</>
}

export default ViewBrief
