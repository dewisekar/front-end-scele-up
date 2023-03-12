import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CRow, CAlert, CBadge } from '@coreui/react'
import { NavLink } from 'react-router-dom'
import DataTable from 'react-data-table-component'
import orderBy from 'lodash/orderBy'

import { execSPWithoutInput } from '../../../utils/request-marketing'
import { LoadingAnimation } from '../../../components'
import { StatusBadge } from '../../../components'
import { getPostStatus, convertDate, getRupiahString, getNumberFormat } from 'src/utils/pageUtil'
import { StoredProcedure, PostStatus } from 'src/constants'
import { columns } from './ListPost.config'

const ListPost = () => {
  const [dataTable, setDataTable] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const BadgeEnum = {
    Terpenuhi: 'success',
    'Lewat Deadline': 'danger',
    Terjadwal: 'warning',
  }

  const renderBadge = (amount) => (
    <CBadge color="primary" shape="rounded-pill">
      {amount}
    </CBadge>
  )

  const customSort = (rows, field, direction) => {
    const RealFields = {
      followers: 'realFollowers',
      costPerSlot: 'realCostPerSlot',
      views: 'realViews',
      shares: 'realShares',
      comments: 'realComments',
      likes: 'realLikes',
      status: 'realStatus',
      cpm: 'realCpm',
    }

    const handleField = (row) => {
      if (RealFields[field]) {
        return row[RealFields[field]]
      }

      return row[field]
    }

    return orderBy(rows, handleField, direction)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { message: fetchedPost = [] } = await execSPWithoutInput(StoredProcedure.GET_ALL_POST)

        const listPosData = fetchedPost.map((item) => {
          const {
            deadlinePost,
            uploadDate,
            costPerSlot,
            followers,
            views,
            shares,
            likes,
            comments,
            cpm,
          } = item
          const convertedDeadlineDate = new Date(deadlinePost)
          const convertedUploadDate = uploadDate ? new Date(uploadDate) : null

          const postStatus = getPostStatus(convertedDeadlineDate, convertedUploadDate)
          const status = PostStatus[postStatus]

          const action = (
            <>
              <NavLink
                to={'/Post/ViewPost?Id=' + item.Id}
                className="btn btn-dark btn-sm"
                style={{ marginRight: '8px', fontSize: '10px' }}
              >
                View
              </NavLink>
              <NavLink
                to={'/Post/UpdatePost?Id=' + item.Id}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '10px' }}
              >
                Update
              </NavLink>
            </>
          )

          return {
            ...item,
            deadlinePost: convertDate(deadlinePost, 'YYYYMMDD'),
            action,
            status: <StatusBadge enumType={BadgeEnum} content={status} />,
            followers: renderBadge(getNumberFormat(followers)),
            views: renderBadge(getNumberFormat(views)),
            shares: renderBadge(getNumberFormat(shares)),
            likes: renderBadge(getNumberFormat(likes)),
            comments: renderBadge(getNumberFormat(comments)),
            costPerSlot: getRupiahString(costPerSlot),
            realFollowers: parseFloat(followers),
            realCostPerSlot: parseFloat(costPerSlot),
            realViews: parseFloat(views),
            realShares: parseFloat(shares),
            realComments: parseFloat(comments),
            realLikes: parseFloat(likes),
            realStatus: status,
            cpm: (
              <CBadge color="success" shape="rounded-pill">
                {getNumberFormat(cpm)}
              </CBadge>
            ),
            realCpm: parseFloat(cpm),
          }
        })

        setDataTable(listPosData)
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

  const renderContent = () => {
    return (
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>List Post</strong>
            </CCardHeader>
            <CCardBody>
              <CAlert color="info">
                Demi kelancaran pengumpulan data statistik, jangan lupa untuk update data post
                setelah KOL melakukan <i>upload</i> di sosial media,{' '}
                <b>maksimal H+1 waktu KOL upload post.</b>
              </CAlert>
              <DataTable
                columns={columns}
                data={dataTable}
                pagination
                paginationRowsPerPageOptions={[10, 25, 50, 100]}
                sortFunction={customSort}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    )
  }

  return <>{isLoading ? renderLoadingAnimation() : renderContent()}</>
}

export default ListPost
