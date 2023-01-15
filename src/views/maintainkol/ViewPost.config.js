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
    key: 'dayNumber',
    label: 'H+N',
  },
  {
    key: 'followers',
    label: 'Followers',
  },
  {
    key: 'views',
    label: 'Views',
  },
  {
    key: 'likes',
    label: 'Likes',
  },
  {
    key: 'shares',
    label: 'Shares',
  },
  {
    key: 'comments',
    label: 'Comments',
  },
]

const styles = {
  container: {
    borderRadius: '5px',
  },
}

export { tableField, styles, statisticField }
