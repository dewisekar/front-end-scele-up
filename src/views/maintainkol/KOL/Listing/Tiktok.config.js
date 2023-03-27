import orderBy from 'lodash/orderBy'

const customSort = (rows, field, direction) => {
  const RealFields = {
    createdAt: 'realCreatedAt',
    costPerSlot: 'realCostPerSlot',
    totalViews: 'realTotalViews',
    minCpm: 'realMinCpm',
    maxCpm: 'realMaxCpm',
    avgCpm: 'realAvgCpm',
    minViews: 'realMinViews',
    maxViews: 'realMaxViews',
    avgViews: 'realAvgViews',
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

const formFields = [
  {
    name: 'username',
    label: 'Username',
    formType: 'input',
    rules: { required: { value: true, message: 'Wajib diisi' } },
  },
  {
    name: 'costPerSlot',
    label: 'Cost Per Slot',
    formType: 'input',
    rules: { required: { value: true, message: 'Wajib diisi' } },
    type: 'number',
  },
]

const tableField = [
  { selector: (row) => row.createdAt, name: 'Tanggal Cek', sortable: true, width: '120px' },
  { selector: (row) => row.username, name: 'Username', sortable: true, width: '200px' },
  { selector: (row) => row.costPerSlot, name: 'Cost Per Slot', sortable: true, width: '200px' },
  { selector: (row) => row.totalViews, name: 'Total Views', sortable: true, width: '150px' },
  { selector: (row) => row.avgCpm, name: 'Average CPM', sortable: true, width: '150px' },
  { selector: (row) => row.avgViews, name: 'Average Views', sortable: true, width: '150px' },
  { selector: (row) => row.minCpm, name: 'Min CPM', sortable: true, width: '150px' },
  { selector: (row) => row.minViews, name: 'Min Views', sortable: true, width: '150px' },
  { selector: (row) => row.maxCpm, name: 'Max CPM', sortable: true, width: '150px' },
  { selector: (row) => row.maxViews, name: 'Max Views', sortable: true, width: '150px' },
]

export { formFields, tableField, customSort }
