import orderBy from 'lodash/orderBy'

const tableColumns = [
  { selector: 'name', name: 'Nama Kol', sortable: true, width: '300px' },
  { selector: 'username', name: 'Username', sortable: true, width: '200px' },
  { selector: 'platform', name: 'Platform', sortable: true },
  { selector: 'subMedia', name: 'Sub Media', sortable: true, width: '150px' },
  { selector: 'contractNo', name: 'Kontrak Ke', sortable: true },
  { selector: 'contractStatus', name: 'Status Kontrak', sortable: true, width: '170px' },
  { selector: 'action', name: 'Action', width: '220px' },
  { selector: 'startDate', name: 'Kontrak Mulai', sortable: true, width: '200px' },
  { selector: 'endDate', name: 'Kontrak Selesai', sortable: true, width: '200px' },
  { selector: 'manager', name: 'PIC', sortable: true, width: '280px' },
  { selector: 'totalSlot', name: 'Jumlah Slot', sortable: true },
  { selector: 'usedSlot', name: 'Slot Terpakai', sortable: true },
  { selector: 'slotLeft', name: 'Sisa Slot', sortable: true },
  { selector: 'price', name: 'Biaya', sortable: true, width: '150px' },
  { selector: 'costPerSlot', name: 'Cost Per Slot', sortable: true, width: '150px' },
]

const customSort = (rows, field, direction) => {
  const RealFields = {
    costPerSlot: 'realCostPerSlot',
    price: 'realPrice',
    endDate: 'realEndDate',
    startDate: 'realStartDate',
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
