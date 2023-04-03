const tableColumns = [
  { name: 'Nama Kategori', selector: (row) => row.category, sortable: true },
  { name: 'Action', selector: (row) => row.action },
]

export { tableColumns }
