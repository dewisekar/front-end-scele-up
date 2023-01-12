import React from 'react'
import { CCol } from '@coreui/react'
import { NavLink } from 'react-router-dom'

import { convertDate } from 'src/utils/pageUtil'

const PostBanner = ({ props }) => {
  const { contractName, deadlinePost, postId, briefName } = props
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
        {!briefName && <p className="m-0 text-light">Deadline: {convertDate(deadlinePost)}</p>}
        {briefName && <p className="m-0 text-light">Brief: {briefName}</p>}
      </div>
    </CCol>
  )
}

export default React.memo(PostBanner)
