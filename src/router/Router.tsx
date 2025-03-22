import React from 'react'
import { Routes, Route } from 'react-router'

import ProtectedRoute from './ProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'

const LoginPage = React.lazy(() => import('../pages/Auth/Login'))
const Home = React.lazy(() => import('../pages/Dashboard/Home'))
const Profile = React.lazy(() => import('../pages/Dashboard/Profile'))
const Settings = React.lazy(() => import('../pages/Dashboard/Settings'))

const Clients = React.lazy(() => import('../pages/Dashboard/Client/Clients'))

function Router() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path='dashboard' element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route path='/dashboard/profile' element={<Profile />} />
          <Route path='/dashboard/settings' element={<Settings />} />
          <Route path='/dashboard/clients' element={<Clients />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default Router
