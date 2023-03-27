import orderBy from 'lodash/orderBy'

const tableColumns = [
  { name: 'Kode', selector: (row) => row.briefCode, sortable: true, width: '150px' },
  { name: 'Tema', selector: (row) => row.Tema, sortable: true, width: '400px' },
  { name: 'PIC', selector: (row) => row.manager, sortable: true, width: '200px' },
  { name: 'Action', selector: (row) => row.action, width: '200px' },
  { name: 'Total Cost', selector: (row) => row.totalCost, sortable: true, width: '150px' },
  { name: 'Total Views', selector: (row) => row.totalViews, sortable: true, width: '150px' },
  { name: 'Total CPM', selector: (row) => row.totalCpm, sortable: true, width: '150px' },
  { name: 'Digunakan (X)', selector: (row) => row.totalPost, sortable: true, width: '130px' },
  { name: 'Total FYP', selector: (row) => row.totalFyp, sortable: true, width: '150px' },
  { name: 'Link', selector: (row) => row.link, sortable: true, width: '150px' },
]

const customSort = (rows, field, direction) => {
  const RealFields = {
    totalCost: 'realTotalCost',
    totalViews: 'realTotalViews',
    totalCpm: 'realTotalCpm',
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

export { tableColumns, customSort }
