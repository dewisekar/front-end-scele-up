import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import { MDBDataTable, MDBTableHead, MDBTableBody } from 'mdbreact'
import { NavLink } from 'react-router-dom'
import fileDownload from 'js-file-download'
import DataTable from 'react-data-table-component'

import { getRequestByUri } from '../../../utils/request-marketing'
import { generalDownload } from '../../../utils/axios-request'
import { LoadingAnimation } from '../../../components'
import { URL, longDateOptions } from 'src/constants'
import { convertDate } from 'src/utils/pageUtil'
import { tableColumns, customSort } from './ListKontrak.config'
import { getRupiahString } from 'src/utils/pageUtil'

const ListKontrak = () => {
  const [dataTable, setDataTable] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedContract = [] } = await getRequestByUri(URL.GET_CONTRACT_LIST)
      const mappedData = fetchedContract.map((data) => {
        const {
          contractStatus,
          managerName: manager,
          Username: username,
          Platform: platform,
          Name: name,
        } = data
        const action = (
          <>
            <NavLink
              to={'/Contract/ViewContract?id=' + data['Kontrak Id']}
              className="btn btn-dark btn-sm my-1"
              style={{ marginRight: '8px', fontSize: '10px' }}
            >
              View
            </NavLink>
            <NavLink
              to={'/Contract/edit?id=' + data['Kontrak Id']}
              className="btn btn-dark btn-sm my-1"
              style={{ marginRight: '8px', fontSize: '10px' }}
            >
              Edit
            </NavLink>
            <CButton
              className="my-1"
              style={{ fontSize: '10px' }}
              onClick={() => downloadContract(data['Kontrak Id'])}
            >
              Download File
            </CButton>
          </>
        )
        const convertedDate = convertDate(new Date(data['Masa Kontrak Akhir']))

        return {
          contractStatus,
          username,
          platform,
          name,
          action,
          subMedia: data['Sub Media'],
          contractNo: data['Kontrak Ke'],
          totalSlot: data['Booking Slot'],
          manager,
          usedSlot: data['Booking Slot'] - data['Sisa Slot'],
          slotLeft: data['Sisa Slot'],
          price: getRupiahString(data['Total Kerjasama']),
          realPrice: parseFloat(data['Total Kerjasama']),
          costPerSlot: getRupiahString(data['Cost Per Slot']),
          realCostPerSlot: parseFloat(data['Cost Per Slot']),
          startDate: new Date(data['Masa Kontrak Mulai']).toLocaleDateString(
            'id-ID',
            longDateOptions,
          ),
          realStartDate: new Date(data['Masa Kontrak Mulai']),
          endDate: new Date(data['Masa Kontrak Akhir']).toLocaleDateString(
            'id-ID',
            longDateOptions,
          ),
          realEndDate: new Date(data['Masa Kontrak Akhir']),
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
              <strong>List Kontrak</strong>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={tableColumns}
                data={dataTable}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationResetDefaultPage={resetPaginationToggle}
                dense
                sortFunction={customSort}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderTable()}</>
}

export default ListKontrak
