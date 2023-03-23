import orderBy from 'lodash/orderBy'

const tableColumns = [
  { name: 'Kode', selector: 'Brief Code', sortable: true, width: '150px' },
  { name: 'Tema', selector: 'Tema', sortable: true, width: '400px' },
  { name: 'PIC', selector: 'manager', sortable: true, width: '200px' },
  { name: 'Action', selector: 'action', width: '200px' },
  { name: 'Total Cost', selector: 'totalCost', sortable: true, width: '150px' },
  { name: 'Total Views', selector: 'totalViews', sortable: true, width: '150px' },
  { name: 'Total CPM', selector: 'totalCpm', sortable: true, width: '150px' },
  { name: 'Digunakan (X)', selector: 'totalPost', sortable: true, width: '130px' },
  { name: 'Total FYP', selector: 'totalFyp', sortable: true, width: '150px' },
  { name: 'Link', selector: 'link', sortable: true, width: '150px' },
]

const customSort = (rows, field, direction) => {
  const RealFields = {
    totalCost: 'realTotalCost',
    totalViews: 'realTotalViews',
    totalCpm: 'realTotalCpm',
  }

  const handleField = (row) => {
    if (RealFields[field]) {
      return row[RealFields[field]]
    }

    return row[field]
  }

  return orderBy(rows, handleField, direction)
}

export { tableColumns, customSort }
