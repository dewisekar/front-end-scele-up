import { PostStatisticKey } from 'src/constants'

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
  { label: 'Cost Per Slot', field: 'costPerSlot', type: 'text' },
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
    key: PostStatisticKey.VIEWS_PER_FOLLOWERS,
    label: 'Views/Followers (*100)',
    color: 'info',
  },
  {
    key: PostStatisticKey.COMMENTS_PER_FOLLOWERS,
    label: 'Comments/Followers (*30K)',
    color: 'info',
  },
  {
    key: PostStatisticKey.SHARES_PER_FOLLOWERS,
    label: 'Shares/Followers (*50K)',
    color: 'info',
  },
  {
    key: PostStatisticKey.COST_PER_VIEWS,
    label: 'Per Views',
    color: 'dark',
  },
  {
    key: PostStatisticKey.CPM,
    label: 'CPM (Cost/1000 Reach)',
    color: 'dark',
  },
  {
    key: PostStatisticKey.ENGAGEMENT_POINT,
    label: 'Engagement Point',
    color: 'primary',
  },
  {
    key: PostStatisticKey.MARKET_READINESS,
    label: 'Market Readiness',
    color: 'primary',
  },
  {
    key: PostStatisticKey.MARKET_READINESS_PER_VIEWS,
    label: 'Ratio Market Readiness/Views',
    color: 'primary',
  },
  {
    key: PostStatisticKey.ENGAGEMENT_POINT_PER_VIEWS,
    label: 'Ratio EP/Views',
    color: 'primary',
  },
]

const styles = {
  container: {
    borderRadius: '5px',
  },
}

const postStatisticKey = [
  PostStatisticKey.VIEWS_PER_FOLLOWERS,
  PostStatisticKey.COMMENTS_PER_FOLLOWERS,
  PostStatisticKey.SHARES_PER_FOLLOWERS,
  PostStatisticKey.COST_PER_VIEWS,
  PostStatisticKey.CPM,
  PostStatisticKey.ENGAGEMENT_POINT,
  PostStatisticKey.ENGAGEMENT_POINT,
  PostStatisticKey.MARKET_READINESS,
  PostStatisticKey.MARKET_READINESS_PER_VIEWS,
  PostStatisticKey.ENGAGEMENT_POINT_PER_VIEWS,
]

export { tableField, styles, statisticField, postStatisticKey }
