import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Menu } from 'primereact/menu'
import { useRef } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import MoreVertIcon from '@mui/icons-material/MoreVert'

interface TableWidgetProps {
  onRemove: () => void
  editable: boolean
}

const rows = [
  { id: 1, col1: 'Viaje 1', col2: 'Mexico' },
  { id: 2, col1: 'Viaje 2', col2: 'Coahuila' },
]

const TableWidget = ({ onRemove, editable }: TableWidgetProps) => {
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
  return (
    <div className='w-full h-full p-4 rounded-lg border text-left shadow-sm bg-white border-gray-200 z-10'>
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

      <h3 className='text-sm font-medium text-gray-500 mb-2'>Tabla de datos</h3>
      <DataTable value={rows} stripedRows scrollable scrollHeight='flex' size='small' rows={5}>
        <Column field='col1' header='Viaje' />
        <Column field='col2' header='Destino' />
      </DataTable>
    </div>
  )
}

export default TableWidget
