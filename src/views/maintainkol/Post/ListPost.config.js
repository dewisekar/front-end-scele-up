const columns = [
  { name: 'Deadline', selector: (row) => row.deadlinePost, width: '150px', sortable: true },
  { name: 'Upload Date', selector: (row) => row.uploadDate, width: '150px', sortable: true },
  { name: 'Kontrak', selector: (row) => row.kontrakName, width: '300px', sortable: true },
  { name: 'Username', selector: (row) => row.username, width: '200px', sortable: true },
  { name: 'Platform', selector: (row) => row.Platform, sortable: true },
  { name: 'Cost Per Slot', selector: (row) => row.costPerSlot, sortable: true, width: '150px' },
  { name: 'CPM', selector: (row) => row.cpm, sortable: true, width: '120px' },
  { name: 'Jenis', selector: (row) => row.jenis, width: '150px', sortable: true },
  { name: 'Kategori', selector: (row) => row.category, sortable: true },
  { name: 'Status', selector: (row) => row.status, sortable: true, width: '150px' },
  { name: 'Manager', selector: (row) => row.managerName, sortable: true, width: '300px' },
  { name: 'Brief Name', selector: (row) => row.briefName, width: '300px', sortable: true },
  { name: 'Action', selector: (row) => row.action, width: '10rem' },
  { name: 'Followers', selector: (row) => row.followers, sortable: true },
  { name: 'FYP', selector: (row) => row.isFyp, sortable: true },
  { name: 'Views', selector: (row) => row.views, sortable: true },
  { name: 'Likes', selector: (row) => row.likes, sortable: true },
  { name: 'Shares', selector: (row) => row.shares, sortable: true },
  { name: 'Comments', selector: (row) => row.comments, sortable: true },
]

export { columns }
