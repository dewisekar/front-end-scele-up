import orderBy from 'lodash/orderBy'

const customSort = (rows, field, direction) => {
  const RealFields = {
    contractEndDate: 'realContractEndDate',
  }

  const [, fieldName] = field.toString().split('row => row.')

  const handleField = (row) => {
    if (RealFields[fieldName]) {
      return row[RealFields[fieldName]]
    }

    return row[fieldName]
  }

  return orderBy(rows, handleField, direction)
}

export { customSort }
