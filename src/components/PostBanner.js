import React from 'react'
import { CCol } from '@coreui/react'
import { NavLink } from 'react-router-dom'

const PostBanner = ({ props }) => {
  const { contractName, deadlinePost, postId } = props
  const styles = {
    container: {
      backgroundColor: '#7B84A1',
      borderRadius: '13px',
    },
    link: {
      textDecoration: 'none',
      fontWeight: '600',
    },
  }

  const convertedDeadlineDate = new Date(deadlinePost)
  const deadlineDay = convertedDeadlineDate.getDate()
  const deadlineMonth = convertedDeadlineDate.getMonth() + 1
  const deadlineYear = convertedDeadlineDate.getFullYear()

  return (
    <CCol md={6} xs={12} s={12} className="pr-2 pl-2 pt-1 pb-1">
      <div style={styles.container} className="p-3 pt-1 pb-1">
        <NavLink
          to={`/MaintainKol/ViewPost?Id=` + postId}
          className="text-light"
          style={styles.link}
        >
          {contractName}
        </NavLink>
        <p className="m-0 text-light">
          Deadline: {deadlineDay}-{deadlineMonth}-{deadlineYear}
        </p>
      </div>
    </CCol>
  )
}

export default React.memo(PostBanner)
