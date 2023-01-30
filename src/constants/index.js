const StoredProcedure = {
  GET_TODAY_POST: '[MARKETING].[dbo].[SP_GetTodayPost]',
  GET_ALL_POST: '[MARKETING].[dbo].[SP_GetListPostForView]',
  GET_MISSED_POST: '[MARKETING].[dbo].[SP_GetMissedPost]',
  GET_KOL_CATEGORY: '[MARKETING].[dbo].[SP_GetKolCategory]',
}

const EventColor = {
  FULFILLED: '#2a9d8f',
  ONSCHEDULE: '#e9c46a',
  MISSED: '#d64242',
}

const DateMode = {
  DDMMYYYY: 'DDMMYYYY',
  YYYYMMDD: 'YYYYMMDD',
}

const PostStatus = {
  FULFILLED: 'FULFILLED',
  ONSCHEDULE: 'ON SCHEDULE',
  MISSED: 'MISSED',
}

const URL = {
  GET_POST_DETAIL: '/getPostDetail?id=',
  GET_KOL_DETAIL: '/getKolDetail?Id=',
  GET_CONTRACT_DETAIL: '/getKontrakDetail?Id=',
  GET_CONTRACT_ITERATION: '/getListKontrakIteration',
  GET_MANAGER_LIST: '/getListManager',
  GET_BRIEF_LIST: '/getListBrief',
  UPDATE_POST: '/updatePost?id=',
  GET_POST_STATISTIC_BY_POST_ID: '/getPostStatisticByPostId?id=',
  GET_CONTRACT_RENEWAL_LIST: '/getContractRenewalList',
  GET_CONTRACT_LIST: '/getListKontrak',
  GET_BRIEF_DETAIL: '/getBriefDetail?id=',
  GET_POST_VIEW_BY_MANAGER: '/getPostViewByManager?id=',
  GET_OVERVIEW: '/getOverview?',
  GET_POST_AND_COST_OVERVIEW: '/getCostAndSlotOverview',
  GET_KOL_LIST_BY_BRIEF_ID: `/getKolListByBrief?id=`,
  BROADCAST_BRIEF: '/broadcastBrief',
  GET_MONTHLY_OVERVIEW: '/getMonthlyOverview',
  GET_BANK_LIST: '/bank-list',
}

const ResponseStatus = {
  TRUE: 'true',
  FALSE: 'false',
}

const ColumnSizePercentage = {
  FULL: 100,
  HALF: 50,
}

const PythonErrorCode = {
  NOT_AVAILABLE: '203',
  FAILED_TO_FETCH: '201',
  EMPTY_DATA: '202',
}

const PostStatisticKey = {
  VIEWS_PER_FOLLOWERS: 'viewsPerFollowers',
  COMMENTS_PER_FOLLOWERS: 'commentsPerFollowers',
  SHARES_PER_FOLLOWERS: 'sharesPerFollowers',
  COST_PER_VIEWS: 'costPerViews',
  CPM: 'cpm',
  ENGAGEMENT_POINT: 'engagementPoint',
  MARKET_READINESS: 'marketReadiness',
  MARKET_READINESS_PER_VIEWS: 'marketReadinessPerViews',
  ENGAGEMENT_POINT_PER_VIEWS: 'engagementPointPerViews',
}

const OverviewParams = {
  BRIEF: 'BRIEF',
  MANAGER: 'MANAGER',
  KOL_CATEGORY: 'KOL_CATEGORY',
  KOL: 'KOL',
}

const OverviewTableField = [
  {
    field: 'yearMonth',
    label: 'Bulan - Tahun',
  },
  {
    field: 'numberOfPost',
    label: 'Jumlah Post',
  },
  {
    field: 'totalViews',
    label: 'Total Views',
  },
  {
    field: 'avgViews',
    label: 'Rata-Rata Views',
  },
  {
    field: 'avgCpm',
    label: 'Rata-Rata CPM',
  },
]

const Platform = ['Tiktok', 'Instagram', 'Twitter', 'Youtube']

const KolType = ['ED', 'BA', 'PP', 'KAS', 'GA', 'Lain-lain', 'Refund']

export {
  StoredProcedure,
  EventColor,
  DateMode,
  PostStatus,
  URL,
  ResponseStatus,
  ColumnSizePercentage,
  PythonErrorCode,
  PostStatisticKey,
  OverviewParams,
  OverviewTableField,
  Platform,
  KolType,
}
