import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCardBody, CCardHeader, CCol, CButtonGroup, CRow } from '@coreui/react'
import ReactApexChart from 'react-apexcharts'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { getRekapPengirimanByMonth } from '../../utils/axios-request'

function getMonthsInYear(inThisYear = true) {
  var today = new Date()
  var thisYear = today.getFullYear()
  var date = new Date(thisYear, 0, 1)
  var month = []
  if (inThisYear) {
    while (date.getFullYear() === thisYear && date.getMonth() <= today.getMonth()) {
      month.push(format(date, 'MMM', { locale: id }))
      date.setMonth(date.getMonth() + 1)
    }
  } else {
    while (date.getFullYear() === thisYear) {
      month.push(format(date, 'MMM', { locale: id }))
      date.setMonth(date.getMonth() + 1)
    }
  }
  return month
}

function getDaysInMonth(month, year) {
  var today = new Date()
  var date = new Date(year, month - 1, 1)
  var dateNum = 1
  var days = []
  if (today.getMonth() != date.getMonth()) {
    while (date.getMonth() + 1 === month) {
      days.push(dateNum)
      date.setDate(date.getDate() + 1)
      dateNum = dateNum + 1
    }
  } else {
    while (date.getMonth() + 1 === month && date.getDate() <= today.getDate()) {
      days.push(dateNum)
      date.setDate(date.getDate() + 1)
      dateNum = dateNum + 1
    }
  }

  return days
}

const RekapPengiriman = () => {
  useEffect(() => {
    getDataRekap(activeMonth)
  }, [])

  const [y1, setY1] = useState([])
  const [y2, setY2] = useState([])
  const [y3, setY3] = useState([])
  const [y4, setY4] = useState([])
  const [xData, setXData] = useState([])
  const [charTitle, setCharTitle] = useState('This is a Chart')
  const [hideTable, setHideTable] = useState(true)
  const [activeMonth, setActiveMonth] = useState(format(new Date(), 'MMM', { locale: id }))

  const getDataRekap = (inputMonth) => {
    let numOfMonth = 'JanFebMarAprMeiJunJulAgtSepOktNovDes'.indexOf(inputMonth) / 3 + 1
    let month = format(new Date(), 'yyyy') + numOfMonth.toString().padStart(2, '0')
    console.log(month)

    let resGetRekapPengirimanByMonth = getRekapPengirimanByMonth(month)
    try {
      resGetRekapPengirimanByMonth.then(function (result) {
        console.log('resGetRekapPengirimanByMonth:', result.status)
        if (result.status === 'true') {
          console.log(result)
          setY1(result.TOTAL_FROM_EXCEL)
          setY2(result.TOTAL_IN_ERP)
          setY3(result.TOTAL_TERPRINT)
          setY4(result.TOTAL_TERKIRIM)
          setXData(result.TANGGAL)
          setCharTitle('Rekap Pengiriman ' + inputMonth)
        }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const GenerateChart = (props) => {
    let series = [
      {
        name: 'Total Invoice diinput dari Excel',
        type: 'column',
        data: props.y1,
      },
      {
        name: 'Total Invoice Sukses ke ERP ',
        type: 'column',
        data: props.y2,
      },
      {
        name: 'Total Invoice di PRINT',
        type: 'column',
        data: props.y3,
      },
      {
        name: 'Total Invoice di KIRIM',
        type: 'column',
        data: props.y4,
      },
    ]

    let options = {
      chart: {
        height: 350,
        type: 'line',
        stacked: false,
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        width: [1, 1, 1, 1],
      },
      title: {
        text: props.title,
        align: 'left',
        offsetX: 110,
      },
      xaxis: {
        // categories: [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016],
        categories: props.x,
      },
      yaxis: [
        {
          axisTicks: {
            show: true,
          },
          axisBorder: {
            show: true,
            color: '#008FFB',
          },
          labels: {
            style: {
              colors: '#008FFB',
            },
          },
          title: {
            text: 'Jumlah',
            style: {
              color: '#008FFB',
            },
          },
          tooltip: {
            enabled: true,
          },
        },
        // {
        //   seriesName: 'Income',
        //   opposite: true,
        //   axisTicks: {
        //     show: true,
        //   },
        //   axisBorder: {
        //     show: true,
        //     color: '#00E396',
        //   },
        //   labels: {
        //     style: {
        //       colors: '#00E396',
        //     },
        //   },
        //   title: {
        //     text: 'Operating Cashflow (thousand crores)',
        //     style: {
        //       color: '#00E396',
        //     },
        //   },
        // },
        // {
        //   seriesName: 'Revenue',
        //   opposite: true,
        //   axisTicks: {
        //     show: true,
        //   },
        //   axisBorder: {
        //     show: true,
        //     color: '#FEB019',
        //   },
        //   labels: {
        //     style: {
        //       colors: '#FEB019',
        //     },
        //   },
        //   title: {
        //     text: 'Revenue (thousand crores)',
        //     style: {
        //       color: '#FEB019',
        //     },
        //   },
        // },
      ],
      tooltip: {
        fixed: {
          enabled: true,
          position: 'topLeft', // topRight, topLeft, bottomRight, bottomLeft
          offsetY: 30,
          offsetX: 60,
        },
      },
      legend: {
        horizontalAlign: 'left',
        offsetX: 40,
      },
    }
    return <ReactApexChart options={options} series={series} type="line" height={350} />
  }

  const clickButtonEnable = (value) => {
    console.log(value)
    console.log(getMonthsInYear())
    if (value == 'Disabled') {
      setHideTable(false)
    } else {
      setHideTable(true)
    }
  }

  const clickButtonMonth = (value) => {
    // console.log(value)
    setActiveMonth(value)
    getDataRekap(value)
  }

  return (
    // <CRow>tes</CRow>
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Rekap Pengiriman</strong> {/*<small>File input</small>*/}
          </CCardHeader>
          <CCardBody>
            <CButtonGroup className="me-3">
              {['Enabled', 'Disabled'].map((value) => (
                <CButton
                  color="outline-secondary"
                  key={value}
                  className="mx-0"
                  onClick={() => clickButtonEnable(value)}
                >
                  {value}
                </CButton>
              ))}
            </CButtonGroup>
          </CCardBody>
        </CCard>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Daily Chart</strong>
          </CCardHeader>
          <CCardBody>
            <CRow className="mb-5">
              <CButtonGroup>
                {getMonthsInYear().map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === activeMonth}
                    onClick={() => clickButtonMonth(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CRow>
            <CRow>
              <GenerateChart title={charTitle} y1={y1} y2={y2} y3={y3} y4={y4} x={xData} />
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default RekapPengiriman
