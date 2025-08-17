import { useEffect } from 'react'
import { useClientStore } from '../../../../../../core/store/ClientStore'
import { useTeamStore } from '../../../../../../core/store/TeamStore'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import ClientStatusTag from '../../../../../ui/Tag/StatusTag'

interface TripClientSelectorProps {
  selectedClientId?: string
  onSelect: (clientId: string) => void
}

const TripClientSelector = ({ selectedClientId, onSelect }: TripClientSelectorProps) => {
  const { currentTeam } = useTeamStore()
  const {
    clients,
    fetchClients,
    search,
    statusFilter,
    first,
    rows,
    totalRecords,

    setSearch,
    setStatusFilter,
    setPagination,
  } = useClientStore()

  useEffect(() => {
    if (currentTeam?.id) fetchClients(currentTeam.id)
  }, [currentTeam?.id, first, rows, search, statusFilter])

  return (
    <div className='flex flex-col gap-6 h-[60vh] overflow-y-auto'>
      <div className='mb-4'>
        <h3 className='text-lg font-semibold mb-2'>Selecciona un cliente</h3>
        <p className='text-sm text-gray-600'>Elige el cliente para el viaje</p>
      </div>

      {/* Filtros */}
      <div className='flex flex-wrap gap-6 items-end'>
        <div className='w-80'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Buscar</label>
          <InputText
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Buscar por nombre, email o RFC'
            className='w-full'
          />
        </div>

        <div className='w-60'>
          <label className='block text-sm font-medium text-gray-700 mb-1'>Estatus</label>
          <Dropdown
            value={statusFilter}
            options={[
              { label: 'Todos', value: '' },
              { label: 'Activo', value: 'ACTIVE' },
              { label: 'Desactivado', value: 'CANCELLED' },
              { label: 'Eliminado', value: 'DELETED' },
            ]}
            onChange={(e) => setStatusFilter(e.value)}
            placeholder='Seleccionar estatus'
            className='w-full'
          />
        </div>
      </div>

      {/* Cartas de clientes */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4'>
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelect(client.id!)}
            className={`border rounded-lg shadow-sm transition cursor-pointer hover:shadow-md ${
              client.id === selectedClientId
                ? 'border-primary ring-2 ring-primary bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className='p-4'>
              <div className='flex items-start justify-between mb-2'>
                <h4 className='font-semibold text-sm'>{client.name}</h4>
                <ClientStatusTag status={client.status!} />
              </div>

              {client.name_related && (
                <p className='text-xs text-gray-500 mb-1'>{client.name_related}</p>
              )}

              <p className='text-xs text-gray-600 mb-1'>RFC: {client.rfc}</p>
              <p className='text-xs text-gray-600 mb-2'>{client.email}</p>
              <p className='text-xs text-gray-600'>{client.phone}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Paginación */}
      {totalRecords > rows && (
        <div className='flex justify-center py-4'>
          <button
            onClick={() => setPagination(first + rows, rows)}
            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover'
          >
            Cargar más clientes
          </button>
        </div>
      )}

      {clients.length === 0 && (
        <div className='text-center py-8 text-gray-500'>
          <i className='pi pi-users text-3xl mb-2'></i>
          <p>No hay clientes disponibles</p>
        </div>
      )}
    </div>
  )
}

export default TripClientSelector
