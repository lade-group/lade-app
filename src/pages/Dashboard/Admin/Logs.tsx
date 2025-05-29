// src/components/features/dashboard/team/TeamLogsPage.tsx
import { useState } from 'react'
import { DataTable, DataTableExpandedRows } from 'primereact/datatable'
import { Column } from 'primereact/column'
import LogActionTag from '../../../components/ui/Tag/LogActionTag'
interface LogEntry {
  id: string
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  entity: string
  entityId: string
  user: {
    name: string
    email: string
  }
  createdAt: string
  meta: any
}

const dummyLogs: LogEntry[] = [
  {
    id: '1',
    action: 'CREATE',
    entity: 'Client',
    entityId: 'abc123',
    user: { name: 'Juan Pérez', email: 'juan@example.com' },
    createdAt: new Date().toISOString(),
    meta: { name: 'Nuevo Cliente', rfc: 'XAXX010101000' },
  },
  {
    id: '2',
    action: 'UPDATE',
    entity: 'Vehicle',
    entityId: 'veh456',
    user: { name: 'María López', email: 'maria@example.com' },
    createdAt: new Date().toISOString(),
    meta: { plate: 'XYZ123', changes: { status: ['DISPONIBLE', 'EN_USO'] } },
  },
  {
    id: '3',
    action: 'DELETE',
    entity: 'Driver',
    entityId: 'drv789',
    user: { name: 'Carlos Ruiz', email: 'carlos@example.com' },
    createdAt: new Date().toISOString(),
    meta: { name: 'Juancho', license: '1234567890' },
  },
]

const LogsPage = () => {
  const [expandedRows, setExpandedRows] = useState<DataTableExpandedRows>({})

  const actionTemplate = (row: LogEntry) => <LogActionTag action={row.action} />

  const rowExpansionTemplate = (data: LogEntry) => (
    <div className='border-t border-gray-200 p-4 bg-gray-50 text-lg space-y-1 flex flex-col gap-2'>
      <div className='text-lg text-primary font-bold'>
        Entidad: <span className='font-normal'>{data.entity}</span>
      </div>
      <div className='text-lg text-primary font-bold'>
        ID: <span className='font-normal'>{data.entityId}</span>
      </div>
      <div className='text-lg text-primary font-bold'>
        Usuario: <span className='font-normal'>{data.user.name}</span> ({data.user.email})
      </div>
      <div className='text-lg text-primary font-bold'>
        Fecha: <span className='font-normal'>{new Date(data.createdAt).toLocaleString()}</span>
      </div>
      <div className='text-lg text-primary font-bold'>Meta:</div>
      <pre className='bg-white text-[11px] rounded border p-2 overflow-x-auto'>
        {JSON.stringify(data.meta, null, 2)}
      </pre>
    </div>
  )

  return (
    <div className='p-6 space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-4xl text-primary font-bold'>Historial</h1>
      </div>
      <div>
        <span className='text-lg text-gray-700'>Ve todos los cambios que hace tu equipo</span>
      </div>
      <div className='w-full pt-4'>
        <DataTable
          value={dummyLogs}
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data as DataTableExpandedRows)}
          rowExpansionTemplate={rowExpansionTemplate}
          paginator
          rows={5}
          dataKey='id'
          className='w-full  rounded-md overflow-hidden '
        >
          <Column expander style={{ width: '3rem' }} />
          <Column field='action' header='Acción' body={actionTemplate} />
          <Column field='entity' header='Entidad' />
          <Column field='user.name' header='Usuario' />
          <Column
            field='createdAt'
            header='Fecha'
            body={(row) => new Date(row.createdAt).toLocaleString()}
          />
        </DataTable>
      </div>
    </div>
  )
}

export default LogsPage
