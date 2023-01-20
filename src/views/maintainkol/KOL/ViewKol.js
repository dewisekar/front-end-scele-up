import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CCard, CCardBody, CCardHeader, CCol, CRow } from '@coreui/react'

import { getRequestByUri, getKolDetailById } from '../../../utils/request-marketing'
import { URL } from 'src/constants'
import { LoadingAnimation, VerticalTable } from 'src/components'

const ViewKol = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [kolDetail, setKolDetail] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const kolDetailField = [
    { key: 'NAME', label: 'Nama' },
    { key: 'PLATFORM', label: 'Platform' },
    { key: 'USERNAME', label: 'Username' },
    { key: 'kolCategory', label: 'Kategori KOL' },
    { key: 'JENIS', label: 'Jenis KOL' },
    { key: 'ALAMAT', label: 'Alamat' },
    { key: 'NO_HP', label: 'Nomor HP' },
    { key: 'ktp', label: 'KTP' },
    { key: 'bank', label: 'BANK' },
    { key: 'NOMOR_REKENING', label: 'No. Rekening' },
  ]

  useEffect(() => {
    try {
      const fetchData = async () => {
        let id = searchParams.get('id')
        const { message: fetchedKol } = await getKolDetailById(id)

        setKolDetail(fetchedKol)
        setIsLoading(false)
      }

      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const renderKolDetail = () => {
    return (
      <CRow id="post-detail">
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol md={6}>
                  <strong>{`Detail Kol`}</strong>
                </CCol>
                <CCol md={6} className="d-flex align-items-start justify-content-end"></CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <VerticalTable fields={kolDetailField} data={kolDetail} />
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
    return <Suspense>{renderKolDetail()}</Suspense>
  }

  return <>{isLoading ? renderLoadingAnimation() : renderPageContent()}</>
}

export default ViewKol
