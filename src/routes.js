import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))
const UploadDailyTrxFile = React.lazy(() => import('./views/upload/UploadDailyTrxFile'))
const UploadResiFile = React.lazy(() => import('./views/upload/UploadResiFile'))
const UploadFileSaldo = React.lazy(() => import('./views/upload/UploadFileSaldo'))
const MonDailyTrxFile = React.lazy(() => import('./views/upload/MonDailyTrxFile'))
const MonFileResi = React.lazy(() => import('./views/upload/MonFileResi'))
const MonJournalJual = React.lazy(() => import('./views/monitoring/MonJournalJual'))
const ScanForPrint = React.lazy(() => import('./views/scan/ScanForPrint'))
const ScanForSent = React.lazy(() => import('./views/scan/ScanForSent'))
const MonSelisih = React.lazy(() => import('./views/monitoring/MonSelisih'))
const Logout = React.lazy(() => import('./views/pages/logout/Logout'))
const RekapPengiriman = React.lazy(() => import('./views/dashboard/RekapPengiriman'))
const InputNewKol = React.lazy(() => import('./views/maintainkol/InputNewKol'))
const ListKol = React.lazy(() => import('./views/maintainkol/ListKol'))
const InputNewContract = React.lazy(() => import('./views/maintainkol/InputNewContract'))
const ListKontrak = React.lazy(() => import('./views/maintainkol/ListKontrak'))
const InputNewBrief = React.lazy(() => import('./views/maintainkol/InputNewBrief'))
const ListBrief = React.lazy(() => import('./views/maintainkol/ListBrief'))
const InputNewManager = React.lazy(() => import('./views/maintainkol/InputNewManager'))
const ListManager = React.lazy(() => import('./views/maintainkol/ListManager'))
const InputNewPost = React.lazy(() => import('./views/maintainkol/InputNewPost'))
const ListPost = React.lazy(() => import('./views/maintainkol/ListPost'))
const ViewPost = React.lazy(() => import('./views/maintainkol/ViewPost'))
const UpdatePost = React.lazy(() => import('./views/maintainkol/UpdatePost'))
const PostCalendar = React.lazy(() => import('./views/maintainkol/PostCalendar'))
// const TestPost = React.lazy(() => import('./views/maintainkol/TestPost'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
  {
    path: '/Upload/UploadDailyTrxFile',
    name: 'Upload Daily Transaction File',
    element: UploadDailyTrxFile,
  },
  {
    path: '/Upload/MonDailyTrxFile',
    name: 'Monitoring Daily Transaction File',
    element: MonDailyTrxFile,
  },
  { path: '/Upload/UploadResiFile', name: 'Upload File Resi', element: UploadResiFile },
  { path: '/Upload/MonFileResi', name: 'Monitoring File Resi', element: MonFileResi },
  { path: '/Upload/UploadFileSaldo', name: 'Upload File Saldo', element: UploadFileSaldo },
  { path: '/Monitoring/MonJournalJual', name: 'Monitoring Journal Jual', element: MonJournalJual },
  { path: '/Scan/ScanForPrint', name: 'Scan For Print', element: ScanForPrint },
  { path: '/Scan/ScanForSent', name: 'Scan For Send', element: ScanForSent },
  { path: '/Monitoring/SelisihData', name: 'Kontrol Pengiriman', element: MonSelisih },
  { path: '/Logout', name: 'Logout', element: Logout },
  { path: '/rekapPengiriman', name: 'Rekap Pengiriman', element: RekapPengiriman },
  { path: '/MaintainKol/InputNewKol', name: 'Input New Kol', element: InputNewKol },
  { path: '/MaintainKol/ListKol', name: 'List Kol', element: ListKol },
  {
    path: '/MaintainKontrakKol/InputNewContract',
    name: 'Input New Contract',
    element: InputNewContract,
  },
  { path: '/MaintainKontrakKol/ListKontrak', name: 'List Kontrak', element: ListKontrak },
  {
    path: '/MaintainKontrakKol/InputNewBrief',
    name: 'Input New Brief',
    element: InputNewBrief,
  },
  { path: '/MaintainKontrakKol/ListBrief', name: 'List Brief', element: ListBrief },
  {
    path: '/MaintainKol/InputNewManager',
    name: 'Input New Manager',
    element: InputNewManager,
  },
  { path: '/MaintainKol/ListManager', name: 'List Manager', element: ListManager },
  {
    path: '/MaintainKol/InputNewPost',
    name: 'Input New Post',
    element: InputNewPost,
  },
  {
    path: '/MaintainKol/ListPost',
    name: 'List Post',
    element: ListPost,
  },
  {
    path: '/MaintainKol/ViewPost',
    name: 'View Post',
    element: ViewPost,
  },
  {
    path: '/MaintainKol/UpdatePost',
    name: 'Update Post',
    element: UpdatePost,
  },
  {
    path: '/MaintainKol/PostCalendar',
    name: 'Post Calendar',
    element: PostCalendar,
  },
  // },
  // {
  //   path: '/MaintainKol/TestPost',
  //   name: 'Test Post',
  //   element: TestPost,
  // },
]

export default routes
