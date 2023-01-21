import React from 'react'

const NumberFormat = ({ number }) => {
  return <>{new Intl.NumberFormat('en-ID').format(number)}</>
}

export default React.memo(NumberFormat)
