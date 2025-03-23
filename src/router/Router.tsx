import React from 'react'
import { Routes, Route } from 'react-router'
import { ROUTES } from '../constants/routes'
import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'

const LoginPage = React.lazy(() => import('../pages/Auth/Login'))
const Home = React.lazy(() => import('../pages/Dashboard/User/Home'))
const Profile = React.lazy(() => import('../pages/Dashboard/User/Profile'))
const Settings = React.lazy(() => import('../pages/Dashboard/User/Settings'))
const TeamSettings = React.lazy(() => import('../pages/Dashboard/Admin/TeamSettings'))

const Clients = React.lazy(() => import('../pages/Dashboard/Client/Clients'))
const Drivers = React.lazy(() => import('../pages/Dashboard/Drivers/Drivers'))

function Router() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='dashboard' element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.PERFIL} element={<Profile />} />
          <Route path={ROUTES.CONFIGURACION} element={<Settings />} />
          <Route path={ROUTES.CLIENTES} element={<Clients />} />
          <Route path={ROUTES.COLABORADORES} element={<Drivers />} />
          <Route path={ROUTES.AJUSTES_DE_EQUIPO} element={<TeamSettings />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default Router
