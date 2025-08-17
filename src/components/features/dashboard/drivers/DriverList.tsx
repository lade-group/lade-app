import { useState, useEffect } from 'react'
import { useDriverStore } from '../../../../core/store/DriverStore'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { ConfirmDialog } from 'primereact/confirmdialog'
import { Toast } from 'primereact/toast'
import DriverStatusTag from '../../../ui/Tag/DriverStatusTag'
import DriverFilterBar from './DriverFilterbar'
import LayoutToggle from '../../../ui/ButtonGroup/LayoutVehicleButtonGroup'
import { useNavigate } from 'react-router'
import { useTeamStore } from '../../../../core/store/TeamStore'
import placeholderImg from '../../../../assets/images/placeholder.jpg'

const DriverList = () => {
  const navigate = useNavigate()
  const { currentTeam } = useTeamStore()
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [searchTerm, setSearchTerm] = useState('')
  const {
    drivers,
    filters,
    fetchDrivers,
    loading,
    hasMore,
    first,
    rows,
    setPagination,
    setFilters,
  } = useDriverStore()

  useEffect(() => {
    if (!currentTeam?.id) {
      return
    }

    fetchDrivers(currentTeam.id)
  }, [first, rows, filters])

  const onScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget
    if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore && !loading) {
      setPagination(first + rows, rows)

      if (!currentTeam) {
        return
      }
      fetchDrivers(currentTeam.id)
    }
  }

  const handleSearch = () => {
    setFilters({ ...filters, search: searchTerm })
  }

  const handleClearSearch = () => {
    setSearchTerm('')
    setFilters({ ...filters, search: undefined })
  }

  if (loading && drivers.length === 0) {
    return (
      <div className='overflow-y-auto h-[80vh]'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div className='flex gap-2'>
            <InputText
              placeholder='Buscar conductores...'
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
              className='flex-1'
            />
            <Button icon='pi pi-search' onClick={handleSearch} className='p-button-primary' />
            {searchTerm && (
              <Button
                icon='pi pi-times'
                onClick={handleClearSearch}
                className='p-button-secondary'
              />
            )}
          </div>
          <DriverFilterBar />
          <LayoutToggle layout={layout} onChange={setLayout} />
        </div>
        <i className='pi pi-spin pi-spinner text-4xl'></i>
      </div>
    )
  }

  if (drivers.length === 0) {
    return (
      <div className='overflow-y-auto h-[80vh]'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
          <div className='flex gap-2'>
            <InputText
              placeholder='Buscar conductores...'
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
              className='flex-1'
            />
            <Button icon='pi pi-search' onClick={handleSearch} className='p-button-primary' />
            {searchTerm && (
              <Button
                icon='pi pi-times'
                onClick={handleClearSearch}
                className='p-button-secondary'
              />
            )}
          </div>
          <DriverFilterBar />
          <LayoutToggle layout={layout} onChange={setLayout} />
        </div>
        <p className='text-gray-500'>No hay conductores disponibles.</p>
      </div>
    )
  }

  return (
    <div className='h-[80vh] overflow-y-auto' onScroll={onScroll}>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-4'>
        <div className='flex gap-2'>
          <InputText
            placeholder='Buscar conductores...'
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            onKeyPress={(e: React.KeyboardEvent) => e.key === 'Enter' && handleSearch()}
            className='flex-1'
          />
          <Button icon='pi pi-search' onClick={handleSearch} className='p-button-primary' />
          {searchTerm && (
            <Button icon='pi pi-times' onClick={handleClearSearch} className='p-button-secondary' />
          )}
        </div>
        <DriverFilterBar />
        <LayoutToggle layout={layout} onChange={setLayout} />
      </div>

      {layout === 'list' ? (
        <div className='flex flex-col divide-y'>
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className='flex gap-4 p-4 hover:bg-gray-50 cursor-pointer'
              onClick={() => navigate(`${driver.id}`)}
            >
              <img
                src={driver.photoUrl && driver.photoUrl !== '' ? driver.photoUrl : placeholderImg}
                alt={driver.name}
                className='w-24 h-24 rounded object-cover'
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = placeholderImg
                }}
              />
              <div className='flex flex-col flex-1'>
                <h2 className='text-lg font-bold'>{driver.name}</h2>
                <p className='text-sm text-gray-600'>Licencia: {driver.licenseNumber}</p>
                <DriverStatusTag status={driver.status} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className='grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-6 gap-6'>
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className='border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col items-center overflow-hidden hover:cursor-pointer'
              onClick={() => navigate(`${driver.id}`)}
            >
              <img
                src={driver.photoUrl && driver.photoUrl !== '' ? driver.photoUrl : placeholderImg}
                alt={driver.name}
                className='w-full h-60 object-cover'
                onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                  e.currentTarget.src = placeholderImg
                }}
              />
              <div className='p-4 text-center w-full'>
                <h2 className='font-bold text-gray-800'>{driver.name}</h2>
                <p className='text-sm text-gray-500'>Licencia: {driver.licenseNumber}</p>
                <DriverStatusTag status={driver.status} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Cargando */}
      {loading && (
        <div className='flex justify-center py-4'>
          <i className='pi pi-spin pi-spinner text-2xl'></i>
        </div>
      )}

      {/* Botón para cargar más */}
      {hasMore && !loading && (
        <div className='flex justify-center py-4'>
          <Button
            label='Cargar más'
            onClick={() => setPagination(first + rows, rows)}
            className='p-button-outlined'
          />
        </div>
      )}

      <Toast />
    </div>
  )
}

export default DriverList
