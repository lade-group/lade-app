import React, { useState, useEffect, useRef } from 'react'
import { Button } from 'primereact/button'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { Toast } from 'primereact/toast'
import { useNotification } from '../../../core/contexts/NotificationContext'

interface Log {
  id: string
  action:
    | 'CREATE'
    | 'UPDATE'
    | 'DELETE'
    | 'ACTIVATE'
    | 'DEACTIVATE'
    | 'REACTIVATE'
    | 'TRANSFER_OWNERSHIP'
    | 'REMOVE_USER'
    | 'LEAVE_TEAM'
    | 'UPLOAD_FILE'
    | 'LOGIN'
    | 'LOGOUT'
  entity:
    | 'TEAM'
    | 'USER'
    | 'CLIENT'
    | 'DRIVER'
    | 'VEHICLE'
    | 'TRIP'
    | 'ROUTE'
    | 'ADDRESS'
    | 'CONTACT'
    | 'DOCUMENT'
  entityId: string
  userId: string
  teamId: string
  metadata: any
  createdAt: string
  user: {
    id: string
    name: string
    email: string
  }
  team: {
    id: string
    name: string
  }
}

interface LogsResponse {
  logs: Log[]
  total: number
  page: number
  limit: number
  totalPages: number
}

const LogsPage = () => {
  const toast = useRef<Toast>(null)
  const { showNotification } = useNotification()
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [expandedRows, setExpandedRows] = useState<any>({})

  useEffect(() => {
    fetchLogs()
  }, [currentPage])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const res = await fetch(`http://localhost:3000/logs/team?page=${currentPage}&limit=20`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      })

      if (!res.ok) throw new Error('Error fetching logs')

      const data: LogsResponse = await res.json()

      // Validar que logs sea un array
      if (!Array.isArray(data.logs)) {
        console.error('Logs no es un array:', data.logs)
        setLogs([])
        setTotalPages(1)
        setTotal(0)
        return
      }

      setLogs(data.logs)
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching logs:', error)
      showNotification('Error al cargar los logs', 'error')
      setLogs([])
      setTotalPages(1)
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  const getActionSeverity = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'success'
      case 'UPDATE':
        return 'warning'
      case 'DELETE':
        return 'danger'
      case 'ACTIVATE':
      case 'REACTIVATE':
        return 'success'
      case 'DEACTIVATE':
        return 'danger'
      case 'LOGIN':
        return 'info'
      case 'LOGOUT':
        return 'secondary'
      default:
        return 'info'
    }
  }

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'Crear'
      case 'UPDATE':
        return 'Actualizar'
      case 'DELETE':
        return 'Eliminar'
      case 'ACTIVATE':
        return 'Activar'
      case 'DEACTIVATE':
        return 'Desactivar'
      case 'REACTIVATE':
        return 'Reactivar'
      case 'TRANSFER_OWNERSHIP':
        return 'Transferir Propiedad'
      case 'REMOVE_USER':
        return 'Remover Usuario'
      case 'LEAVE_TEAM':
        return 'Salir del Equipo'
      case 'UPLOAD_FILE':
        return 'Subir Archivo'
      case 'LOGIN':
        return 'Iniciar Sesión'
      case 'LOGOUT':
        return 'Cerrar Sesión'
      default:
        return action
    }
  }

  const getEntityLabel = (entity: string) => {
    switch (entity) {
      case 'TEAM':
        return 'Equipo'
      case 'USER':
        return 'Usuario'
      case 'CLIENT':
        return 'Cliente'
      case 'DRIVER':
        return 'Conductor'
      case 'VEHICLE':
        return 'Vehículo'
      case 'TRIP':
        return 'Viaje'
      case 'ROUTE':
        return 'Ruta'
      case 'ADDRESS':
        return 'Dirección'
      case 'CONTACT':
        return 'Contacto'
      case 'DOCUMENT':
        return 'Documento'
      default:
        return entity
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  }

  const actionBodyTemplate = (rowData: Log) => {
    return (
      <Tag value={getActionLabel(rowData.action)} severity={getActionSeverity(rowData.action)} />
    )
  }

  const entityBodyTemplate = (rowData: Log) => {
    return getEntityLabel(rowData.entity)
  }

  const userBodyTemplate = (rowData: Log) => {
    return rowData.user.name
  }

  const dateBodyTemplate = (rowData: Log) => {
    return formatDate(rowData.createdAt)
  }

  const expandedRowTemplate = (data: Log) => {
    return (
      <div className='p-4 bg-gray-50 border-t border-gray-200'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <div className='space-y-3'>
            <div>
              <strong className='text-gray-700'>Entidad:</strong>
              <span className='ml-2 text-gray-900'>{getEntityLabel(data.entity)}</span>
            </div>
            <div>
              <strong className='text-gray-700'>ID de Entidad:</strong>
              <span className='ml-2 text-gray-900 font-mono text-sm'>{data.entityId}</span>
            </div>
            <div>
              <strong className='text-gray-700'>Usuario:</strong>
              <span className='ml-2 text-gray-900'>{data.user.name}</span>
            </div>
            <div>
              <strong className='text-gray-700'>Email:</strong>
              <span className='ml-2 text-gray-900'>{data.user.email}</span>
            </div>
          </div>
          <div className='space-y-3'>
            <div>
              <strong className='text-gray-700'>Fecha:</strong>
              <span className='ml-2 text-gray-900'>{formatDate(data.createdAt)}</span>
            </div>
            <div>
              <strong className='text-gray-700'>Acción:</strong>
              <Tag
                value={getActionLabel(data.action)}
                severity={getActionSeverity(data.action)}
                className='ml-2'
              />
            </div>
            <div>
              <strong className='text-gray-700'>Equipo:</strong>
              <span className='ml-2 text-gray-900'>{data.team.name}</span>
            </div>
          </div>
        </div>

        {data.metadata && Object.keys(data.metadata).length > 0 && (
          <div className='mt-4'>
            <strong className='text-gray-700 block mb-2'>Metadatos:</strong>
            <div className='p-3 bg-white rounded border border-gray-300'>
              <pre className='text-sm text-gray-800 overflow-auto max-h-40'>
                {JSON.stringify(data.metadata, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    )
  }

  const paginationTemplate =
    'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown'

  const currentPageReportTemplate = () => {
    return `Mostrando ${(currentPage - 1) * 20 + 1} a ${Math.min(currentPage * 20, total)} de ${total} registros`
  }

  return (
    <div className='p-6 space-y-6'>
      <Toast ref={toast} />

      <div className='flex justify-between items-center'>
        <h1 className='text-4xl text-primary font-bold'>Registro de Actividades</h1>
        <div className='flex gap-2'>
          <Button
            label='Expandir Todo'
            icon='pi pi-plus'
            onClick={() => {
              const allExpanded = logs.reduce((acc: any, log) => {
                acc[log.id] = true
                return acc
              }, {})
              setExpandedRows(allExpanded)
            }}
            className='p-button-outlined'
          />
          <Button
            label='Contraer Todo'
            icon='pi pi-minus'
            onClick={() => setExpandedRows({})}
            className='p-button-outlined'
          />
          <Button
            label='Actualizar'
            icon='pi pi-refresh'
            onClick={fetchLogs}
            className='p-button-secondary'
          />
        </div>
      </div>

      <div className='flex justify-between items-center'>
        <span className='text-lg'>
          Historial completo de todas las acciones realizadas en el sistema
        </span>
        <span className='text-sm text-gray-600'>
          {Object.keys(expandedRows).length} de {logs.length} filas expandidas
        </span>
      </div>

      <div className='bg-white rounded-lg shadow'>
        <DataTable
          value={logs}
          loading={loading}
          paginator
          rows={20}
          totalRecords={total}
          first={(currentPage - 1) * 20}
          onPage={(e) => setCurrentPage((e.page || 0) + 1)}
          paginatorTemplate={paginationTemplate}
          currentPageReportTemplate={currentPageReportTemplate()}
          emptyMessage='No hay registros de actividad'
          className='p-datatable-sm'
          expandedRows={expandedRows}
          onRowToggle={(e) => setExpandedRows(e.data)}
          rowExpansionTemplate={expandedRowTemplate}
          dataKey='id'
        >
          <Column expander style={{ width: '3rem' }} />
          <Column
            field='action'
            header='Acción'
            body={actionBodyTemplate}
            style={{ width: '120px' }}
          />
          <Column
            field='entity'
            header='Entidad'
            body={entityBodyTemplate}
            style={{ width: '100px' }}
          />
          <Column
            field='user.name'
            header='Usuario'
            body={userBodyTemplate}
            style={{ width: '150px' }}
          />
          <Column
            field='createdAt'
            header='Fecha'
            body={dateBodyTemplate}
            style={{ width: '180px' }}
          />
        </DataTable>
      </div>
    </div>
  )
}

export default LogsPage
