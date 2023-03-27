const tableColumns = [
  { name: 'Name', selector: (row) => row.name, sortable: true },
  { name: 'Username', selector: (row) => row.username, sortable: true },
  { name: 'Platform', selector: (row) => row.platform, sortable: true },
  { name: 'Kategori', selector: (row) => row.category, sortable: true },
  { name: 'Jenis', selector: (row) => row.type, sortable: true },
  { name: 'Action', selector: (row) => row.action },
]

const platformOptions = [
  { label: 'Tiktok', value: 'Tiktok' },
  { label: 'Instagram', value: 'Instagram' },
  { label: 'Twitter', value: 'Twitter' },
  { label: 'Youtube', value: 'Youtube' },
]

const typeOptions = [
  { label: 'Endorse', value: 'Endorse' },
  { label: 'Brand Ambassador', value: 'Brand Ambassador' },
  { label: 'Paid Promote', value: 'Paid Promote' },
  { label: 'KAS', value: 'KAS' },
  { label: 'Giveaway', value: 'Giveaway' },
  { label: 'Lain-lain', value: 'Lain-lain' },
  { label: 'Refund', value: 'Refund' },
]

export { tableColumns, platformOptions, typeOptions }
