import { Chart } from 'primereact/chart'
import { useEffect, useRef, useState } from 'react'
import { Menu } from 'primereact/menu'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface ChartWidgetProps {
  onRemove: () => void
  editable: boolean
}

const BarCharWidget = ({ onRemove, editable }: ChartWidgetProps) => {
  const menuRef = useRef<any>(null)
  const [chartData, setChartData] = useState({})
  const [chartOptions, setChartOptions] = useState({})

  const items = [
    {
      label: 'Eliminar',
      icon: <DeleteIcon fontSize='small' className='mr-2' />,
      command: onRemove,
      template: (item: any, options: any) => (
        <button onClick={options.onClick} className='flex items-center w-full px-2 py-1 text-sm'>
          {item.icon}
          {item.label}
        </button>
      ),
    },
  ]

  useEffect(() => {
    setChartData({
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],
      datasets: [
        {
          label: 'Usuarios',
          data: [1200, 1900, 3000, 2500],
          backgroundColor: '#3B82F6',
        },
      ],
    })

    setChartOptions({
      maintainAspectRatio: false,
      responsive: true,
      plugins: {
        legend: {
          labels: { color: '#374151' },
        },
      },
      scales: {
        x: { ticks: { color: '#6B7280' }, grid: { color: '#E5E7EB' } },
        y: { ticks: { color: '#6B7280' }, grid: { color: '#E5E7EB' } },
      },
    })
  }, [])

  return (
    <div className='h-full w-full p-4 bg-white border border-gray-200 rounded-lg shadow-sm relative'>
      {editable && (
        <div className='absolute top-2 right-2 z-10'>
          <Menu model={items} popup ref={menuRef} />
          <button
            onClick={(e) => menuRef.current?.toggle(e)}
            className='text-gray-500 hover:text-primary'
          >
            <MoreVertIcon fontSize='small' />
          </button>
        </div>
      )}
      <h3 className='text-sm font-medium text-gray-500 mb-2'>Gráfica de barras</h3>
      <div className='h-full'>
        <Chart type='bar' data={chartData} options={chartOptions} />
      </div>
    </div>
  )
}

export default BarCharWidget
