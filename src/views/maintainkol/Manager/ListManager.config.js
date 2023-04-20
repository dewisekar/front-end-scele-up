const columns = [
  { name: 'Nama', selector: (row) => row.name, width: '300px', sortable: true },
  { name: 'No. HP', selector: (row) => row.phone, width: '200px', sortable: true },
  { name: 'Email', selector: (row) => row.email, width: '300px', sortable: true },
  { name: 'Alias', selector: (row) => row.alias, width: '150px', sortable: true },
  { name: 'Action', selector: (row) => row.action, width: '150px' },
]

export { columns }
