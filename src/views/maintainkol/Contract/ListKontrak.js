import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CButton } from '@coreui/react'
import { NavLink } from 'react-router-dom'
import fileDownload from 'js-file-download'
import DataTable from 'react-data-table-component'

import { getRequestByUri, deleteRequestByUri } from '../../../utils/request-marketing'
import { generalDownload } from '../../../utils/axios-request'
import { convertDataToSelectOptions } from 'src/utils/GeneralFormInput'
import {
  LoadingAnimation,
  MultiplePropertyFilter,
  ConfirmationModal,
  ErrorModal,
} from '../../../components'
import { URL, longDateOptions } from 'src/constants'
import {
  tableColumns,
  customSort,
  BadgeEnum,
  platformOptions,
  contractStatusOptions,
} from './ListKontrak.config'
import { getRupiahString } from 'src/utils/pageUtil'
import { StatusBadge } from '../../../components'

const ListKontrak = () => {
  const [dataTable, setDataTable] = useState([])
  const [managerList, setManagerList] = useState([])
  const [filterText, setFilterText] = useState({
    other: '',
    contractStatus: '',
    platform: '',
    manager: '',
  })
  const [isLoading, setIsLoading] = useState(true)
  const [resetPaginationToggle, setResetPaginationToggle] = useState(true)
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false)
  const [isAlertModalShown, setIsAlertModalShown] = useState(false)
  const [modalMessage, setModalMessage] = useState({ title: 'Hapus Kontrak', message: '' })
  const [chosenId, setChosenId] = useState(null)

  const onDeleteContract = (id) => {
    setChosenId(id)
    setIsConfirmationModalVisible(true)
  }

  const closeAlertModal = () => {
    setIsAlertModalShown(false)
    window.location.reload()
  }

  const onConfirmDelete = async () => {
    const { message } = await deleteRequestByUri(URL.CONTRACT + chosenId)

    setIsConfirmationModalVisible(false)
    setModalMessage({ ...modalMessage, message })
    setIsAlertModalShown(true)
  }

  const filterFields = [
    {
      name: 'platform',
      formType: 'select',
      placeholder: 'Platform...',
      options: platformOptions,
    },
    {
      name: 'contractStatus',
      formType: 'select',
      placeholder: 'Status...',
      options: contractStatusOptions,
    },
    {
      name: 'manager',
      formType: 'select',
      placeholder: 'PIC...',
      options: managerList,
    },
  ]

  useEffect(() => {
    const fetchData = async () => {
      const { message: fetchedContract = [] } = await getRequestByUri(URL.GET_CONTRACT_LIST)
      const { message: fetchedManager } = await getRequestByUri(URL.GET_MANAGER_LIST)
      setManagerList(convertDataToSelectOptions(fetchedManager, 'Manager Name', 'Manager Name'))
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
              style={{ marginRight: '8px', fontSize: '10px' }}
              onClick={() => downloadContract(data['Kontrak Id'])}
            >
              Download File
            </CButton>
            <CButton
              className="btn btn-danger btn-sm"
              style={{ fontSize: '10px' }}
              onClick={() => onDeleteContract(data['Kontrak Id'])}
            >
              Delete
            </CButton>
          </>
        )

        return {
          contractStatus: <StatusBadge enumType={BadgeEnum} content={contractStatus} />,
          realContractStatus: contractStatus,
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
  const onFilter = (data) => {
    const { contractStatus = '', other = '', platform = '', manager = '' } = data
    setFilterText({ contractStatus, other, platform, manager })
    setResetPaginationToggle(!resetPaginationToggle)
  }

  const filteredContract = dataTable.filter((item) => {
    const { platform, realContractStatus, subMedia, username, name, manager } = item
    const otherItem = { username, name, subMedia }

    const contractStatusFilter =
      filterText.contractStatus === ''
        ? realContractStatus
        : realContractStatus.toLowerCase() === filterText.contractStatus

    return Object.keys(otherItem).some(
      (key) =>
        otherItem[key].toLowerCase().includes(filterText.other.toLowerCase()) &&
        platform.toLowerCase().includes(filterText.platform) &&
        contractStatusFilter &&
        manager.toLowerCase().includes(filterText.manager),
    )
  })

  const renderTable = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Kontrak</strong>
            </CCardHeader>
            <CCardBody>
              <MultiplePropertyFilter
                title="Filter KOL Kontrak"
                fields={filterFields}
                isWithTime={false}
                onSubmit={onFilter}
              />
              <DataTable
                columns={tableColumns}
                data={filteredContract}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                paginationResetDefaultPage={resetPaginationToggle}
                dense
                sortFunction={customSort}
              />
            </CCardBody>
          </CCard>
          <ConfirmationModal
            isVisible={isConfirmationModalVisible}
            onClose={() => setIsConfirmationModalVisible(false)}
            modalMessage={{
              title: 'Hapus Kontrak',
              message:
                'Anda yakin ingin menghapus kontrak ini? Semua post dan statistiknya akan iku terhapus',
            }}
            onConfirm={onConfirmDelete}
            confirmButtonLabel="Ya, Hapus"
          />
          <ErrorModal
            isVisible={isAlertModalShown}
            onClose={closeAlertModal}
            modalMessage={modalMessage}
          />
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderTable()}</>
}

export default ListKontrak
