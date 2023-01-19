import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CTable } from '@coreui/react'
import { NavLink } from 'react-router-dom'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation } from '../../../components'
import { convertDate } from 'src/utils/pageUtil'
import { URL } from 'src/constants'

const ContractRenewalOverview = () => {
  const tableField = [
    { field: 'kolName', label: 'Nama KOL' },
    { field: 'contractNumber', label: 'Kontrak Ke' },
    { field: 'totalSlot', label: 'Jumlah Slot' },
    { field: 'uploadedPost', label: 'Slot Terpenuhi' },
    { field: 'missedPost', label: 'Slot Tidak Terpenuhi' },
    { field: 'contractEndDate', label: 'Tanggal Kontrak Berakhir' },
    { field: 'dateDifference', label: 'Jumlah Hari Sebelum Kadaluarsa' },
    { field: 'action', label: 'Action' },
  ]
  const [contractData, setContractData] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedContract } = await getRequestByUri(URL.GET_CONTRACT_RENEWAL_LIST)
      const mappedData = fetchedContract.map((data) => {
        const { missedPost, uploadedPost, contractId } = data
        const action = (
          <>
            <NavLink
              to={'/Contract/ViewContract?id=' + contractId}
              className="btn btn-dark btn-sm"
              style={{ marginRight: '8px' }}
            >
              View
            </NavLink>
          </>
        )
        return {
          ...data,
          missedPost: missedPost.toString(),
          uploadedPost: uploadedPost.toString(),
          action,
          contractEndDate: convertDate(new Date(data.contractEndDate)),
        }
      })
      setContractData(mappedData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const renderLoadingAnimation = () => {
    return (
      <CRow>
        <LoadingAnimation />
      </CRow>
    )
  }

  const renderTable = (field, data) => {
    let input = {
      columns: field,
      rows: data,
    }
    return <MDBDataTable striped bordered data={input}></MDBDataTable>
  }

  const renderContent = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Kontrak KOL Untuk Diperbarui</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody>{renderTable(tableField, contractData)}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ContractRenewalOverview
