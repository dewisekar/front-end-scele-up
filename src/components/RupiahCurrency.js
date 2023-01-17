import React from 'react'

const RupiahCurrency = ({ balance }) => {
  return (
    <>
      {new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
      }).format(balance)}
    </>
  )
}

export default React.memo(RupiahCurrency)
