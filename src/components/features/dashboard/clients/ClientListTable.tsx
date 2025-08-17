import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { DataTable, DataTableSelectEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'
import ClientStatusTag from '../../../ui/Tag/StatusTag'
import { useClientStore } from '../../../../core/store/ClientStore'
import { ROUTES } from '../../../../constants/routes'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'

const ClientListTable = () => {
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()

  const {
    clients,
    totalRecords,
    search,
    statusFilter,
    first,
    rows,
    loading,
    setSearch,
    setStatusFilter,
    setPagination,
    fetchClients,
    updateClientStatus,
    deleteClient,
  } = useClientStore()

  const statusOptions = [
    { label: 'Todos', value: '' },
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Desactivado', value: 'CANCELLED' },
    { label: 'Eliminado', value: 'DELETED' },
  ]

  useEffect(() => {
    if (!currentTeam) {
      return
    }
    fetchClients(currentTeam.id)
  }, [first, rows, search, statusFilter])

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setPagination(event.first, event.rows)
  }

  const rowSelected = (e: DataTableSelectEvent) => {
    navigate(`${ROUTES.CLIENTES}/${e.data.id || e.data.code}`)
  }

  const statusBodyTemplate = (client: any) => {
    return <ClientStatusTag status={client.status} />
  }

  const actionsBodyTemplate = (client: any) => {
    const handleStatusChange = async (newStatus: 'ACTIVE' | 'CANCELLED' | 'DELETED') => {
      if (!currentTeam) return

      const success = await updateClientStatus(client.id, newStatus, currentTeam.id)
      if (success) {
        showNotification('Status actualizado exitosamente', 'success')
      } else {
        showNotification('Error al actualizar el status', 'error')
      }
    }

    const handleDelete = () => {
      if (!currentTeam) return

      confirmDialog({
        message:
          '¿Estás seguro de que quieres desactivar este cliente? El cliente se marcará como desactivado pero no se eliminará.',
        header: 'Confirmar desactivación',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
          const success = await deleteClient(client.id, currentTeam.id)
          if (success) {
            showNotification('Cliente desactivado exitosamente', 'success')
          } else {
            showNotification('Error al desactivar el cliente', 'error')
          }
        },
      })
    }

    return (
      <div className='flex gap-2'>
        <Button
          icon='pi pi-pencil'
          className='p-button-sm p-button-outlined'
          onClick={() => navigate(`${ROUTES.CLIENTES}/${client.id}`)}
          tooltip='Editar cliente'
        />
        <Button
          icon='pi pi-trash'
          className='p-button-sm p-button-danger p-button-outlined'
          onClick={handleDelete}
          tooltip='Desactivar cliente'
        />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-6'>
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Filtros */}
      <div className='flex flex-wrap gap-6 items-end'>
        <div className='flex flex-col gap-2'>
          <label htmlFor='search'>Buscar por nombre, email o RFC</label>
          <InputText
            id='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Buscar clientes...'
            className='w-80'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='status-filter'>Estatus</label>
          <Dropdown
            id='status-filter'
            value={statusFilter}
            options={statusOptions}
            onChange={(e) => setStatusFilter(e.value)}
            placeholder='Seleccionar estatus'
            className='w-60'
          />
        </div>
      </div>

      {/* Tabla */}
      <DataTable
        value={clients}
        removableSort
        sortMode='multiple'
        tableStyle={{ minWidth: '70rem' }}
        selectionMode='single'
        onRowSelect={rowSelected}
        scrollable
        scrollHeight='flex'
        loading={loading}
        emptyMessage='No se encontraron clientes'
      >
        <Column field='id' header='ID' sortable style={{ width: '80px' }} />
        <Column field='name' header='Nombre asignado' sortable />
        <Column field='name_related' header='Nombre referencia' sortable />
        <Column field='rfc' header='RFC' sortable />
        <Column field='email' header='Email' sortable />
        <Column field='phone' header='Teléfono' sortable />
        <Column field='status' header='Estatus' body={statusBodyTemplate} sortable />
        <Column header='Acciones' body={actionsBodyTemplate} style={{ width: '120px' }} />
      </DataTable>

      {/* Paginación */}
      {totalRecords > rows && (
        <div className='pt-4'>
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  )
}

export default ClientListTable
