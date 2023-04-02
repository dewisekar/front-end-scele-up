import orderBy from 'lodash/orderBy'

const tableColumns = [
  { name: 'Deadline Post', selector: (row) => row.deadlinePost, sortable: true, width: '150px' },
  { name: 'KOL', selector: (row) => row.contractName, sortable: true, width: '200px' },
  { name: 'Status', selector: (row) => row.status, sortable: true, width: '100px' },
  { name: 'PIC', selector: (row) => row.pic, sortable: true, width: '180px' },
  { name: 'Username', selector: (row) => row.username, sortable: true, width: '180px' },
  { name: 'Platform', selector: (row) => row.platform, sortable: true, width: '150px' },
]

const customSort = (rows, field, direction) => {
  const RealFields = {
    deadlinePost: 'realDeadlinePost',
    status: 'realStatus',
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

const BadgeEnum = {
  'Hari Ini': 'warning',
  Terlambat: 'danger',
}

export { customSort, tableColumns, BadgeEnum }
