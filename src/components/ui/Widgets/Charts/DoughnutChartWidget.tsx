import { Chart } from 'primereact/chart'
import { useEffect, useRef, useState } from 'react'
import { Menu } from 'primereact/menu'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface ChartWidgetProps {
  onRemove: () => void
  editable: boolean
}

const DoughnutChartWidget = ({ onRemove, editable }: ChartWidgetProps) => {
  const [data, setData] = useState({})
  const [options, setOptions] = useState({})

  const menuRef = useRef<any>(null)

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
    setData({
      labels: ['Productividad', 'Retrasos', 'Ausencias'],
      datasets: [
        {
          data: [65, 20, 15],
          backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
          hoverBackgroundColor: ['#059669', '#D97706', '#DC2626'],
        },
      ],
    })

    setOptions({
      responsive: true,
      plugins: {
        legend: {
          position: 'left',
        },
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
      <h3 className='text-sm font-medium text-gray-500 mb-2'>Distribución operativa</h3>
      <div className='h-full'>
        <Chart type='doughnut' data={data} options={options} className='w-full md:w-30rem' />
      </div>
    </div>
  )
}

export default DoughnutChartWidget
