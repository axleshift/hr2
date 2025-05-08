import React, { useEffect, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle } from '@coreui/utils'

const MainChart = ({ labels, datasets }) => {
  const chartRef = useRef(null)

  // Dynamically calculate the max and stepSize for Y-axis
  const { maxY, stepSize } = useMemo(() => {
    const allDataPoints = datasets.flatMap(dataset => dataset.data)
    const max = Math.max(...allDataPoints, 0)
    const roundedMax = Math.ceil(max / 50) * 50 || 250
    return {
      maxY: roundedMax,
      stepSize: Math.ceil(roundedMax / 5),
    }
  }, [datasets])

  useEffect(() => {
    const updateColors = () => {
      if (chartRef.current) {
        const xGrid = chartRef.current.options.scales.x.grid
        const xTicks = chartRef.current.options.scales.x.ticks
        const yGrid = chartRef.current.options.scales.y.grid
        const yTicks = chartRef.current.options.scales.y.ticks

        xGrid.borderColor = getStyle('--cui-border-color-translucent')
        xGrid.color = getStyle('--cui-border-color-translucent')
        xTicks.color = getStyle('--cui-body-color')

        yGrid.borderColor = getStyle('--cui-border-color-translucent')
        yGrid.color = getStyle('--cui-border-color-translucent')
        yTicks.color = getStyle('--cui-body-color')

        chartRef.current.update()
      }
    }

    document.documentElement.addEventListener('ColorSchemeChange', updateColors)
    return () => document.documentElement.removeEventListener('ColorSchemeChange', updateColors)
  }, [])

  return (
    <CChartLine
      ref={chartRef}
      // style={{ height: '300px', marginTop: '40px' }}
      data={{ labels, datasets }}
      options={{
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          x: {
            grid: {
              color: getStyle('--cui-border-color-translucent'),
              drawOnChartArea: false,
            },
            ticks: {
              color: getStyle('--cui-body-color'),
            },
          },
          y: {
            beginAtZero: true,
            max: maxY,
            grid: {
              color: getStyle('--cui-border-color-translucent'),
            },
            border: {
              color: getStyle('--cui-border-color-translucent'),
            },
            ticks: {
              color: getStyle('--cui-body-color'),
              maxTicksLimit: 5,
              stepSize: stepSize,
            },
          },
        },
        elements: {
          line: {
            tension: 0.4,
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3,
          },
        },
      }}
    />
  )
}

MainChart.propTypes = {
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
  datasets: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default MainChart
