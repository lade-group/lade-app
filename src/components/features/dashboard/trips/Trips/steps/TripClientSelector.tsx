import { useEffect } from 'react'
import { useClientStore } from '../../../../../../core/store/ClientStore'
import { useTeamStore } from '../../../../../../core/store/TeamStore'
import { TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
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
      {/* Filtros */}
      <div className='flex flex-wrap gap-6 items-end'>
        <TextField
          label='Buscar por nombre, email o RFC'
          variant='outlined'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size='small'
          className='w-80'
        />

        <FormControl size='small' className='w-60'>
          <InputLabel id='status-filter-label'>Estatus</InputLabel>
          <Select
            labelId='status-filter-label'
            value={statusFilter}
            label='Estatus'
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <MenuItem value=''>Todos</MenuItem>
            <MenuItem value='ACTIVE'>Activo</MenuItem>
            <MenuItem value='CANCELLED'>Desactivado</MenuItem>
            <MenuItem value='DELETED'>Eliminado</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Tabla simple de selección */}
      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5  gap-2'>
        {clients.map((client) => (
          <div
            key={client.id}
            onClick={() => onSelect(client.id!)}
            className={`rounded-md shadow-sm transition  flex gap-4 p-4 cursor-pointer hover:bg-gray-50 ${
              client.id === selectedClientId
                ? 'bg-blue-50 border-l-4 border-y-2 border-r-2 border-primary'
                : 'border-gray-100 border-2'
            }`}
          >
            <div className='flex flex-col flex-1 gap-2'>
              <h2 className='text-md font-bold'>{client.name}</h2>
              <p className='text-sm text-gray-600'>
                {client.email} · {client.rfc}
              </p>
              <ClientStatusTag status={client.status!} />
            </div>
          </div>
        ))}
      </div>

      {/* Paginación simple */}
      {totalRecords > rows && (
        <div className='flex justify-center py-2'>
          <button
            onClick={() => setPagination(first + rows, rows)}
            className='bg-primary text-white px-4 py-2 rounded hover:bg-primary-hover'
          >
            Cargar más
          </button>
        </div>
      )}
    </div>
  )
}

export default TripClientSelector
