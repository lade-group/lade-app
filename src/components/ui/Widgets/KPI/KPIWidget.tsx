import { Menu } from 'primereact/menu'
import { useRef } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface KPIWidgetProps {
  onRemove: () => void
  editable: boolean
}

const KPIWidget = ({ onRemove, editable }: KPIWidgetProps) => {
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

  const data = {
    name: 'Viajes En proceso Febrero',
    stat: '10,450',
    change: '-12.5%',
    changeType: 'negative',
  }

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
      <dt className='text-sm font-medium text-gray-500'>{data.name}</dt>
      <dd className='mt-2 flex items-baseline space-x-2.5'>
        <span className='text-3xl font-semibold text-gray-900'>{data.stat}</span>
        <span
          className={`text-sm font-medium ${
            data.changeType === 'positive' ? 'text-emerald-700' : 'text-red-700'
          }`}
        >
          {data.change}
        </span>
      </dd>
    </div>
  )
}

export default KPIWidget
