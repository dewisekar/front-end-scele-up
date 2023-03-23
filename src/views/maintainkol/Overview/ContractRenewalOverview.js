import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CBadge } from '@coreui/react'
import { NavLink } from 'react-router-dom'
import DataTable from 'react-data-table-component'

import { getRequestByUri } from '../../../utils/request-marketing'
import { LoadingAnimation, MultiplePropertyFilter } from '../../../components'
import { convertDate } from 'src/utils/pageUtil'
import { URL } from 'src/constants'
import { customSort } from './ContractRenewalOverview.config'

const ContractRenewalOverview = () => {
  const tableField = [
    { selector: 'kolName', name: 'Nama KOL', sortable: true, width: '250px' },
    { selector: 'platform', name: 'Platform', sortable: true },
    { selector: 'contractNumber', name: 'Kontrak Ke' },
    { selector: 'totalSlot', name: 'Jumlah Slot' },
    { selector: 'uploadedPost', name: 'Slot Terpenuhi' },
    { selector: 'missedPost', name: 'Slot Tidak Terpenuhi' },
    { selector: 'contractEndDate', name: 'Tanggal Kontrak Berakhir', sortable: true },
    { selector: 'dateDifference', name: 'Jumlah Hari Sebelum Kadaluarsa', sortable: true },
    { selector: 'action', name: 'Action' },
  ]
  const [contractData, setContractData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(true)
  const [filterText, setFilterText] = useState({ platform: '', type: '', category: '', other: '' })

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedContract = [] } = await getRequestByUri(URL.GET_CONTRACT_RENEWAL_LIST)
      const mappedData = fetchedContract.map((data) => {
        const { missedPost, uploadedPost, contractId, totalSlot } = data
        const action = (
          <>
            <NavLink
              to={'/Contract/ViewContract?id=' + contractId}
              className="btn btn-dark btn-sm"
              style={{ marginRight: '8px', fontSize: '10px' }}
            >
              View
            </NavLink>
          </>
        )
        return {
          ...data,
          totalSlot: (
            <CBadge color="primary" shape="rounded-pill">
              {totalSlot}
            </CBadge>
          ),
          missedPost: (
            <CBadge color="danger" shape="rounded-pill">
              {missedPost}
            </CBadge>
          ),
          uploadedPost: (
            <CBadge color="success" shape="rounded-pill">
              {uploadedPost}
            </CBadge>
          ),
          action,
          contractEndDate: convertDate(new Date(data.contractEndDate)),
          realContractEndDate: new Date(data.contractEndDate),
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

  const onFilter = (data) => {
    const { other = '' } = data
    setFilterText({ other })
    setResetPaginationToggle(!resetPaginationToggle)
  }

  const filteredContract = contractData.filter((item) => {
    const { kolName } = item

    return kolName.toLowerCase().includes(filterText.other)
  })

  const renderTable = () => {
    return (
      <>
        <MultiplePropertyFilter title="Filter Kontrak" isWithTime={false} onSubmit={onFilter} />
        <DataTable
          columns={tableField}
          data={filteredContract}
          sortFunction={customSort}
          pagination
          paginationRowsPerPageOptions={[10, 25, 50, 100]}
          paginationResetDefaultPage={resetPaginationToggle}
          dense
        />
      </>
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
            <CCardBody>{renderTable()}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ContractRenewalOverview
