import { useState, useEffect } from 'react'
import RoutesListTable from '../../../components/features/dashboard/trips/routes/RoutesListTable'
import RouteFilterBar from '../../../components/features/dashboard/routes/RouteFilterBar'
import DialogCreateRoute from '../../../components/features/dashboard/routes/DialogCreateRoute'
import { useRouteStore } from '../../../core/store/RouteStore'
import { useTeamStore } from '../../../core/store/TeamStore'

const Routes = () => {
  const { currentTeam } = useTeamStore()
  const { routes, search, statusFilter, setSearch, setStatusFilter, fetchRoutes } = useRouteStore()

  useEffect(() => {
    if (currentTeam) {
      fetchRoutes(currentTeam.id)
    }
  }, [currentTeam, fetchRoutes, search, statusFilter])

  const hasActiveFilters = search || statusFilter

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
  }

  return (
    <div className='w-full h-full'>
      <div>
        <h1 className='text-4xl text-primary font-bold'>Rutas</h1>
      </div>
      <div>
        <span className='text-lg'>
          Conecta tus Locaciones y crea rutas de transporte para tus viajes
        </span>
      </div>

      <div className='w-full pt-5'>
        <div className='space-y-4'>
          <div className='flex justify-between items-center'>
            <RouteFilterBar />
            <DialogCreateRoute />
          </div>

          {hasActiveFilters && (
            <div className='flex justify-end'>
              <button
                onClick={clearFilters}
                className='text-sm text-gray-600 hover:text-gray-800 underline'
              >
                Limpiar Filtros
              </button>
            </div>
          )}

          <RoutesListTable />
        </div>
      </div>
    </div>
  )
}

export default Routes
