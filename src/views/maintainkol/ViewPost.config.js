const tableField = [
  { label: 'Status', field: 'postStatus', type: 'text' },
  { label: 'Nama Kol', field: 'kolName', type: 'text' },
  { label: 'Platform', field: 'platform', type: 'text' },
  { label: 'Username', field: 'username', type: 'text' },
  { label: 'Kontrak Ke', field: 'contractNumber', type: 'text' },
  { label: 'Slot Ke', field: 'slotNumber', type: 'text' },
  { label: 'Tanggal Deadline', field: 'deadlineDate', type: 'text' },
  { label: 'Tanggal Upload', field: 'uploadDate', type: 'text' },
  { label: 'Kode Brief', field: 'briefCode', type: 'text' },
  { label: 'Nama Brief', field: 'briefName', type: 'text' },
  { label: 'PIC KOL', field: 'kolManager', type: 'text' },
  { label: 'Link Post', field: 'linkPost', type: 'link' },
]

const statisticField = [
  {
    key: 'followers',
    label: 'Followers',
    color: 'secondary',
  },
  {
    key: 'views',
    label: 'Views',
    color: 'secondary',
  },
  {
    key: 'likes',
    label: 'Likes',
    color: 'secondary',
  },
  {
    key: 'shares',
    label: 'Shares',
    color: 'secondary',
  },
  {
    key: 'comments',
    label: 'Comments',
    color: 'secondary',
  },
  {
    key: 'viewsPerFollowers',
    label: 'Views/Followers (*100)',
    color: 'info',
  },
  {
    key: 'commentsPerFollowers',
    label: 'Comments/Followers (*30K)',
    color: 'info',
  },
  {
    key: 'sharesPerFollowers',
    label: 'Shares/Followers (*50K)',
    color: 'info',
  },
  {
    key: 'cwViews',
    label: 'Per Views',
    color: 'dark',
  },
  {
    key: 'cwCPM',
    label: 'CPM (Cost/1000 Reach)',
    color: 'dark',
  },
]

const styles = {
  container: {
    borderRadius: '5px',
  },
}

export { tableField, styles, statisticField }
