import orderBy from 'lodash/orderBy'

const tableColumns = [
  { selector: (row) => row.name, name: 'Nama Kol', sortable: true, width: '300px' },
  { selector: (row) => row.username, name: 'Username', sortable: true, width: '200px' },
  { selector: (row) => row.platform, name: 'Platform', sortable: true },
  { selector: (row) => row.subMedia, name: 'Sub Media', sortable: true, width: '150px' },
  { selector: (row) => row.contractNo, name: 'Kontrak Ke', sortable: true },
  { selector: (row) => row.contractStatus, name: 'Status Kontrak', sortable: true, width: '170px' },
  { selector: (row) => row.action, name: 'Action', width: '300px' },
  { selector: (row) => row.startDate, name: 'Kontrak Mulai', sortable: true, width: '200px' },
  { selector: (row) => row.endDate, name: 'Kontrak Selesai', sortable: true, width: '200px' },
  { selector: (row) => row.manager, name: 'PIC', sortable: true, width: '280px' },
  { selector: (row) => row.totalSlot, name: 'Jumlah Slot', sortable: true },
  { selector: (row) => row.usedSlot, name: 'Slot Terpakai', sortable: true },
  { selector: (row) => row.slotLeft, name: 'Sisa Slot', sortable: true },
  { selector: (row) => row.price, name: 'Biaya', sortable: true, width: '150px' },
  { selector: (row) => row.costPerSlot, name: 'Cost Per Slot', sortable: true, width: '150px' },
]

const customSort = (rows, field, direction) => {
  const RealFields = {
    costPerSlot: 'realCostPerSlot',
    price: 'realPrice',
    endDate: 'realEndDate',
    startDate: 'realStartDate',
    contractStatus: 'realContractStatus',
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
  AKTIF: 'success',
  'SLOT PENUH': 'primary',
  'PERLU DIPERBARUI': 'warning',
  'TIDAK AKTIF': 'danger',
}

const platformOptions = [
  { label: 'Tiktok', value: 'Tiktok' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Twitter', value: 'Twitter' },
  { label: 'Youtube', value: 'Youtube' },
]

const contractStatusOptions = [
  { label: 'AKTIF', value: 'AKTIF' },
  { label: 'SLOT PENUH', value: 'SLOT PENUH' },
  { label: 'PERLU DIPERBARUI', value: 'PERLU DIPERBARUI' },
  { label: 'TIDAK AKTIF', value: 'TIDAK AKTIF' },
]

export { tableColumns, customSort, BadgeEnum, platformOptions, contractStatusOptions }
