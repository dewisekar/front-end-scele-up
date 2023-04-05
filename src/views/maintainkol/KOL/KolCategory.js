import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalTitle,
  CModalFooter,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import { useForm } from 'react-hook-form'

import {
  execSPWithoutInput,
  postRequestByUri,
  patchRequestByUri,
  deleteRequestByUri,
} from '../../../utils/request-marketing'
import { LoadingAnimation, TextInput, ErrorModal, ConfirmationModal } from 'src/components'
import { tableColumns } from './KolCategory.config'
import { StoredProcedure } from 'src/constants'

const KolCategory = () => {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [inputModalTitle, setInputModalTitle] = useState(null)
  const [isDisabled, setIsDisabled] = useState(false)
  const [chosenCategoryId, setChosenCategoryId] = useState(null)
  const [isAlertModalShown, setIsAlertModalShown] = useState(false)
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState({})

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    control,
    clearErrors,
  } = useForm()
  const [isInputModalVisible, setIsInputModalVisible] = useState(false)
  const formProps = {
    name: 'category',
    label: 'Nama Kategori',
    formType: 'input',
    rules: { required: { value: true, message: 'Wajib diisi' } },
    register,
    errors,
    control,
  }

  const onClickEditCategory = (id, name) => {
    clearErrors()
    setChosenCategoryId(id)
    setValue('category', name)
    setInputModalTitle('Edit Kategori')
    setIsInputModalVisible(true)
  }

  const onClickAddCategory = () => {
    clearErrors()
    setChosenCategoryId(null)
    setInputModalTitle('Tambah Kategori')
    setValue('category', null)
    setIsInputModalVisible(true)
  }

  const onClickDeleteCategory = (id) => {
    setChosenCategoryId(id)
    setIsConfirmationModalVisible(true)
  }

  const handleAddEdit = async (data) => {
    const isEdit = chosenCategoryId !== null
    const params = isEdit ? `/${chosenCategoryId}` : ''
    const url = `/kol/category${params}`
    setIsDisabled(true)

    try {
      const { status, message } = isEdit
        ? await patchRequestByUri(url, data)
        : await postRequestByUri(url, data)
      const action = status === 'false' ? 'Gagal' : 'Berhasil'

      setModalMessage({ title: `${action} Menyimpan Kategori`, message })
      setIsInputModalVisible(false)
      setIsAlertModalShown(true)
    } catch (error) {
      console.log('Error: ', error)
    }
    setIsDisabled(false)
  }

  const handleDelete = async () => {
    const url = `/kol/category/${chosenCategoryId}`
    setIsDisabled(true)
    setIsLoading(true)

    try {
      const { status, message } = await deleteRequestByUri(url, data)
      const action = status === 'false' ? 'Gagal' : 'Berhasil'

      setModalMessage({ title: `${action} Menghapus Kategori`, message })
      setIsConfirmationModalVisible(false)
      setIsAlertModalShown(true)
    } catch (error) {
      console.log('Error: ', error)
    }
    setIsLoading(false)
    setIsDisabled(false)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: fetchedCategory } = await execSPWithoutInput(
          StoredProcedure.GET_KOL_CATEGORY,
        )
        const mappedCategory = fetchedCategory.map((item) => {
          const { id, category } = item
          const action = (
            <>
              <CButton
                className="btn btn-dark btn-sm"
                style={{ marginRight: '8px', fontSize: '10px' }}
                onClick={() => onClickEditCategory(id, category)}
              >
                Edit
              </CButton>
              <CButton
                className="btn btn-danger btn-sm text-white"
                style={{ fontSize: '10px' }}
                onClick={() => onClickDeleteCategory(id)}
              >
                Delete
              </CButton>
            </>
          )

          return { ...item, action }
        })

        setData(mappedCategory)
        setIsLoading(false)
      } catch (error) {
        console.log(error)
      }
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

  const renderModal = () => (
    <CModal visible={isInputModalVisible} onClose={() => setIsInputModalVisible(false)}>
      <CModalHeader>
        <CModalTitle>{inputModalTitle}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CRow>
          <TextInput {...formProps} key={formProps.name} />
        </CRow>
      </CModalBody>
      <CModalFooter>
        <CButton
          color="secondary"
          onClick={() => setIsInputModalVisible(false)}
          disabled={isDisabled}
        >
          Batal
        </CButton>
        <CButton color="primary" onClick={handleSubmit(handleAddEdit)} disabled={isDisabled}>
          Simpan
        </CButton>
      </CModalFooter>
    </CModal>
  )

  const closeAlertModal = () => {
    setIsAlertModalShown(false)
    window.location.reload()
  }

  const renderContent = () => {
    return (
      <CRow>
        {renderModal()}
        <ErrorModal
          isVisible={isAlertModalShown}
          onClose={closeAlertModal}
          modalMessage={modalMessage}
        />
        <ConfirmationModal
          isVisible={isConfirmationModalVisible}
          onClose={() => setIsConfirmationModalVisible(false)}
          modalMessage={{
            title: 'Hapus Kategori',
            message: 'Anda yakin ingin menghapus kategori ini?',
          }}
          onConfirm={handleDelete}
          confirmButtonLabel="Ya, Hapus"
          isDisabled={isDisabled}
        />
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Kol</strong>
              <CButton
                className="btn btn-info btn-sm text-white"
                style={{ fontSize: '10px', marginLeft: '10px' }}
                onClick={onClickAddCategory}
              >
                Tambah
              </CButton>
            </CCardHeader>
            <CCardBody>
              <DataTable
                columns={tableColumns}
                data={data}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                dense
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default KolCategory
