import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { NavLink } from 'react-router-dom'
import fileDownload from 'js-file-download'

import { getRequestByUri } from '../../../utils/request-marketing'
import { generalDownload } from '../../../utils/axios-request'
import { LoadingAnimation, NoDataAvailable } from '../../../components'
import { URL } from 'src/constants'
import { convertDate } from 'src/utils/pageUtil'
const tableField = [
  { field: 'Name', label: 'Nama Kol' },
  { field: 'Platform', label: 'Platform' },
  { field: 'Sub Media', label: 'Sub Media' },
  { field: 'Username', label: 'Username' },
  { field: 'Kontrak Ke', label: 'Kontrak Ke' },
  { field: 'Booking Slot', label: 'Jumlah Booking Slot' },
  { field: 'managerName', label: 'Manager' },
  { field: 'Masa Kontrak Akhir', label: 'Masa Kontrak Akhir' },
  { field: 'contractStatus', label: 'Status Kontrak' },
  { field: 'action', label: 'Action' },
]

const ListKontrak = () => {
  const [dataTable, setDataTable] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedContract = [] } = await getRequestByUri(URL.GET_CONTRACT_LIST)
      const mappedData = fetchedContract.map((data) => {
        const action = (
          <>
            <NavLink
              to={'/Contract/ViewContract?id=' + data['Kontrak Id']}
              className="btn btn-dark btn-sm mb-1"
              style={{ marginRight: '8px' }}
            >
              View
            </NavLink>
            <NavLink
              to={'/Contract/edit?id=' + data['Kontrak Id']}
              className="btn btn-dark btn-sm mb-1"
              style={{ marginRight: '8px' }}
            >
              Edit
            </NavLink>
            <CButton onClick={() => downloadContract(data['Kontrak Id'])}>Download File</CButton>
          </>
        )
        const convertedDate = convertDate(new Date(data['Masa Kontrak Akhir']))

        return {
          ...data,
          action,
          'Masa Kontrak Akhir': convertedDate,
        }
      })
      setDataTable(mappedData)
      setIsLoading(false)
    }

    fetchData()
  }, [])

  const downloadContract = async (fileId) => {
    try {
      const { filename } = await getRequestByUri('/checkFileStatus?FileId=' + fileId.toString())
      const downloadedFile = await generalDownload('/downloadFile?file=' + filename)
      console.log('resDownloadFile: ', downloadedFile)
      if (downloadedFile !== undefined) {
        let fileOnly = filename.split('/')[filename.split('/').length - 1]
        console.log('fileOnly:', fileOnly)
        fileDownload(downloadedFile, fileOnly)
        return
      }
    } catch (err) {
      console.log(err)
    }
  }

  const renderLoadingAnimation = () => {
    return (
      <CRow>
        <LoadingAnimation />
      </CRow>
    )
  }

  const renderTable = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Kontrak</strong> {/*<small>File input</small>*/}
            </CCardHeader>
            <CCardBody style={{ overflowX: 'scroll' }}>
              <DatatablePage data={dataTable} />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  const DatatablePage = (props) => {
    let dataInput = {
      columns: tableField,
      rows: props.data,
    }
    return props.data.length > 0 ? (
      <MDBDataTable striped bordered data={dataInput}>
        <MDBTableHead columns={dataInput.columns} />
        <MDBTableBody rows={dataInput.rows} />
      </MDBDataTable>
    ) : (
      <NoDataAvailable />
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderTable()}</>
}

export default ListKontrak
