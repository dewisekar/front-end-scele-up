import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAlert, CTable } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'

import { getRequestByUri } from '../../utils/request-marketing'
import { LoadingAnimation } from '../../components'
import { getPostStatus, convertDate } from 'src/utils/pageUtil'
import { URL } from 'src/constants'

const ContractRenewalOverview = () => {
  const tableField = [
    { key: 'kolName', label: 'Nama KOL' },
    { key: 'contractNumber', label: 'Kontrak Ke' },
    { key: 'totalSlot', label: 'Jumlah Slot' },
    { key: 'uploadedPost', label: 'Slot Terpenuhi' },
    { key: 'missedPost', label: 'Slot Tidak Terpenuhi' },
    { key: 'dateDifference', label: 'Jumlah Hari Sebelum Kadaluarsa' },
  ]
  const [contractData, setContractData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const fetchData = async () => {
        const { message: fetchedContract } = await getRequestByUri(URL.GET_CONTRACT_RENEWAL_LIST)
        const mappedData = fetchedContract.map((data) => {
          const { missedPost, uploadedPost } = data
          return {
            ...data,
            missedPost: missedPost.toString(),
            uploadedPost: uploadedPost.toString(),
          }
        })
        setContractData(mappedData)
        console.log(fetchedContract)
        setIsLoading(false)
      }

      fetchData()
    } catch (err) {
      console.log(err)
    }
  }, [])

  const renderLoadingAnimation = () => {
    return (
      <CRow>
        <LoadingAnimation />
      </CRow>
    )
  }

  const renderContent = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Kontrak KOL Untuk Diperbarui</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>{<CTable items={contractData} columns={tableField} bordered />}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ContractRenewalOverview
