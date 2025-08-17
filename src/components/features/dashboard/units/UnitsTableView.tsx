// src/components/features/dashboard/vehicles/VehicleList.tsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { Link } from 'react-router'
import VehicleStatusTag from '../../../ui/Tag/VehicleStatusTag'
import VehicleFilterBar from './VehicleFilterBar'
import LayoutToggle from '../../../ui/ButtonGroup/LayoutVehicleButtonGroup'
import { useVehicleStore } from '../../../../core/store/VehicleStore'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'
import VehicleLogo from '../../../ui/VehicleLogo/VehicleLogo'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import { useRef } from 'react'

const VehicleList = () => {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const toast = useRef<Toast>(null)
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()
  const {
    vehicles,
    fetchVehicles,
    setPagination,
    hasMore,
    loading,
    first,
    rows,
    filters,
    setFilters,
    deleteVehicle,
  } = useVehicleStore()

  useEffect(() => {
    if (!currentTeam?.id) {
      return
    }
    fetchVehicles(currentTeam.id)
  }, [first, rows, filters])

  useEffect(() => {
    setFilters({ ...filters, search: searchTerm })
  }, [searchTerm])

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      setPagination(first + rows, rows)

      if (!currentTeam) {
        return
      }
      fetchVehicles(currentTeam.id)
    }
  }

  if (loading && vehicles.length === 0) {
    return (
      <div className='overflow-y-auto h-[80vh]'>
        <Toast ref={toast} />
        <ConfirmDialog />

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='md:col-span-2'>
            <span className='p-input-icon-left w-full'>
              <i className='pi pi-search' />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Buscar vehículos...'
                className='w-full p-inputtext'
              />
            </span>
          </div>
          <div className='flex justify-end layout-toggle'>
            <LayoutToggle layout={layout} onChange={setLayout} />
          </div>
        </div>

        <VehicleFilterBar />
        <i className='pi pi-spin pi-spinner text-4xl text-primary'></i>
      </div>
    )
  }

  if (vehicles.length === 0) {
    return (
      <div className='overflow-y-auto h-[80vh]'>
        <Toast ref={toast} />
        <ConfirmDialog />

        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
          <div className='md:col-span-2'>
            <span className='p-input-icon-left w-full'>
              <i className='pi pi-search' />
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Buscar vehículos...'
                className='w-full p-inputtext'
              />
            </span>
          </div>
          <div className='flex justify-end layout-toggle'>
            <LayoutToggle layout={layout} onChange={setLayout} />
          </div>
        </div>

        <VehicleFilterBar />
        <p className='text-gray-500'>No hay vehículos disponibles.</p>
      </div>
    )
  }

  return (
    <div className='h-[80vh] overflow-y-auto' onScroll={onScroll}>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-6'>
        <div className='md:col-span-2'>
          <span className='p-input-icon-left w-full'>
            <i className='pi pi-search' />
            <InputText
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder='Buscar vehículos...'
              className='w-full p-inputtext'
            />
          </span>
        </div>
        <div className='flex justify-end layout-toggle'>
          <LayoutToggle layout={layout} onChange={setLayout} />
        </div>
      </div>

      <VehicleFilterBar />

      {layout === 'list' ? (
        <div className='flex flex-col divide-y'>
          {vehicles.map((v) => (
            <Link
              key={v.id}
              to={`/dashboard/unidades/${v.id}`}
              className='flex gap-4 p-4 hover:bg-gray-50 cursor-pointer'
            >
              <VehicleLogo vehicle={v} size='lg' />
              <div className='flex flex-col flex-1'>
                <h2 className='text-lg font-bold'>{v.plate}</h2>
                <p className='text-sm text-gray-600'>
                  {v.brand} · {v.model} · {v.type}
                </p>
                <VehicleStatusTag status={v.status} />
                {v.nextMaintenance && (
                  <p className='text-xs text-orange-600 mt-1'>
                    <i className='pi pi-calendar mr-1'></i>
                    Mantenimiento: {new Date(v.nextMaintenance).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
          {vehicles.map((v) => (
            <Link
              key={v.id}
              to={`/dashboard/unidades/${v.id}`}
              className='vehicle-card cursor-pointer border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300 bg-white flex flex-col items-center overflow-hidden'
            >
              <VehicleLogo vehicle={v} size='full' />
              <div className='p-4 text-center space-y-2 w-full'>
                <h2 className='text-lg font-bold text-gray-800'>{v.plate}</h2>
                <p className='text-sm text-gray-500'>
                  {v.brand} · {v.model}
                </p>
                <p className='text-xs text-gray-400'>{v.type}</p>
                <VehicleStatusTag status={v.status} />
                {v.nextMaintenance && (
                  <p className='text-xs text-orange-600 mt-1'>
                    <i className='pi pi-calendar mr-1'></i>
                    Mantenimiento: {new Date(v.nextMaintenance).toLocaleDateString()}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Cargando */}
      {loading && (
        <div className='flex justify-center py-4'>
          <i className='pi pi-spin pi-spinner text-2xl text-primary'></i>
        </div>
      )}

      {/* Botón para cargar más */}
      {hasMore && !loading && (
        <div className='flex justify-center py-4'>
          <Button
            label='Cargar más'
            icon='pi pi-plus'
            className='p-button-outlined'
            onClick={() => setPagination(first + rows, rows)}
          />
        </div>
      )}
    </div>
  )
}

export default VehicleList
