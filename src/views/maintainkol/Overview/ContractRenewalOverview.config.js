import orderBy from 'lodash/orderBy'

const customSort = (rows, field, direction) => {
  const RealFields = {
    contractEndDate: 'realContractEndDate',
  }

  const handleField = (row) => {
    if (RealFields[field]) {
      return row[RealFields[field]]
    }

    return row[field]
  }

  return orderBy(rows, handleField, direction)
}

export { customSort }
