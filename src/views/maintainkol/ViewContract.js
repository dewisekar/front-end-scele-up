import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CTable,
  CTableRow,
  CTableHead,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react'

import { getRequestByUri } from '../../utils/request-marketing'
import { URL, ColumnSizePercentage, PostStatus, PostStatisticKey } from 'src/constants'
import { RupiahCurrency, LoadingAnimation } from 'src/components'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'
import { countPostStatistic } from 'src/utils/postUtil'

const ViewContract = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [contractId, setContractId] = useState(null)
  const [contactDetail, setContractDetail] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const contractDetailField = [
    { key: 'contractStatus', label: 'Status Kontrak' },
    { key: 'kolName', label: 'Nama Kol' },
    { key: 'kolCategory', label: 'Kategori KOL' },
    { key: 'platform', label: 'Platform' },
    { key: 'Sub Media', label: 'Sub Media' },
    { key: 'username', label: 'Username' },
    { key: 'kolType', label: 'Jenis KOL' },
    { key: 'kolPhone', label: 'No. WhatsApp' },
    { key: 'contractNumber', label: 'Kontrak Ke' },
    { key: 'managerName', label: 'Manager' },
    { key: 'contractStartDate', label: 'Masa Kontrak Mulai' },
    { key: 'contractEndDate', label: 'Masa Kontrak Akhir' },
    { key: 'contractSignDate', label: 'Tgl Kontrak' },
    { key: 'Booking Slot', label: 'Jumlah Booking Slot' },
    { key: 'Total Kerjasama', label: 'Total Kerjasama' },
    { key: 'costPerSlot', label: 'Cost Per Slot' },
    { key: 'DP', label: 'Down Payment' },
    { key: 'remainingPayment', label: 'Sisa Pembayaran' },
    { key: 'uploadedPost', label: 'Jumlah Post Terupload' },
    { key: 'missedPost', label: 'Jumlah Post Belum Terupload' },
  ]

  useEffect(() => {
    try {
      let contractId = searchParams.get('id')
      setContractId(contractId)

      const fetchData = async () => {
        const { message: fetchedDetail } = await getRequestByUri(
          URL.GET_CONTRACT_DETAIL + contractId,
        )

        const contractStartDate = convertDate(new Date(fetchedDetail['Masa Kontrak Mulai']))
        const contractEndDate = convertDate(new Date(fetchedDetail['Masa Kontrak Akhir']))
        const contractSignDate = convertDate(new Date(fetchedDetail['Tgl Kontrak']))
        const DP = fetchedDetail['DP'] + '%'
        const remainingPayment =
          fetchedDetail['Total Kerjasama'] -
          (fetchedDetail['Total Kerjasama'] * fetchedDetail['DP']) / 100

        setContractDetail({
          ...fetchedDetail,
          contractEndDate,
          contractStartDate,
          contractSignDate,
          remainingPayment: <RupiahCurrency balance={remainingPayment} />,
          DP,
          'Total Kerjasama': <RupiahCurrency balance={fetchedDetail['Total Kerjasama']} />,
          costPerSlot: <RupiahCurrency balance={fetchedDetail['costPerSlot']} />,
        })
        setIsLoading(false)
      }

      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const renderContractInfo = (fields, data) => {
    const info = fields.map((item, index) => {
      return (
        <CTableRow key={item.key}>
          <CTableHeaderCell>{item.label}</CTableHeaderCell>
          <CTableDataCell>{data[item.key]}</CTableDataCell>
        </CTableRow>
      )
    })

    return info
  }

  const renderPostDetail = () => {
    return (
      <CRow id="post-detail">
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol md={6}>
                  <strong>{`Detail Kontrak`}</strong>
                </CCol>
                <CCol md={6} className="d-flex align-items-start justify-content-end"></CCol>
              </CRow>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol>
                  <CTable bordered>
                    <CTableBody>
                      {renderContractInfo(contractDetailField, contactDetail)}
                    </CTableBody>
                  </CTable>
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
    return <Suspense>{renderPostDetail()}</Suspense>
  }

  return <>{isLoading ? renderLoadingAnimation() : renderPageContent()}</>
}

export default ViewContract
