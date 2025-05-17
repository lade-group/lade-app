import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router'
import { ROUTES } from '../constants/routes'
import AuthenticatedRoute from './AuthenticatedRoute'
import TeamProtectedRoute from './TeamProtectedRoute'
import DashboardLayout from '../layouts/DashboardLayout'
import Loader from '../components/ui/Loader/Loader'

const LoginPage = React.lazy(() => import('../pages/Auth/Login'))
const RegisterPage = React.lazy(() => import('../pages/Auth/Register'))
const LoginSuccess = React.lazy(() => import('./LoginSuccessRoute'))

const JoinTeamFallbackPage = React.lazy(() => import('../pages/Team/TeamSelection'))
const CreateTeamWizardPage = React.lazy(() => import('../pages/Team/CreateTeamWizard'))

const Home = React.lazy(() => import('../pages/Dashboard/User/Home'))
const Profile = React.lazy(() => import('../pages/Dashboard/User/Profile'))
const Settings = React.lazy(() => import('../pages/Dashboard/User/Settings'))
const TeamSettings = React.lazy(() => import('../pages/Dashboard/Admin/TeamSettings'))

const Locations = React.lazy(() => import('../pages/Dashboard/Trips/Locations'))
const Location = React.lazy(() => import('../pages/Dashboard/Trips/Location'))
const RoutesPage = React.lazy(() => import('../pages/Dashboard/Trips/Routes'))
const RoutePage = React.lazy(() => import('../pages/Dashboard/Trips/Route'))
const Trips = React.lazy(() => import('../pages/Dashboard/Trips/Trips'))
const Trip = React.lazy(() => import('../pages/Dashboard/Trips/Trip'))

const Clients = React.lazy(() => import('../pages/Dashboard/Client/Clients'))
const Client = React.lazy(() => import('../pages/Dashboard/Client/Client'))

const Drivers = React.lazy(() => import('../pages/Dashboard/Drivers/Drivers'))
const Driver = React.lazy(() => import('../pages/Dashboard/Drivers/Driver'))

const Invoices = React.lazy(() => import('../pages/Dashboard/Invoices/Invoices'))

const Units = React.lazy(() => import('../pages/Dashboard/Units/Units'))

const NotFoundPage = React.lazy(() => import('../pages/General/NoFoundPage'))

function Router() {
  return (
    <Suspense fallback={<Loader message='Cargando contenido...' />}>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='login/success' element={<LoginSuccess />} />

        <Route element={<AuthenticatedRoute />}>
          <Route path='equipos' element={<JoinTeamFallbackPage />} />
          <Route path='equipos/crear' element={<CreateTeamWizardPage />} />
        </Route>

        <Route element={<TeamProtectedRoute />}>
          <Route path='dashboard' element={<DashboardLayout />}>
            <Route index element={<Home />} />

            <Route path={ROUTES.VIAJES}>
              <Route index element={<Trips />} />
              <Route path=':id' element={<Trip />} />
            </Route>

            <Route path={ROUTES.LOCACIONES}>
              <Route index element={<Locations />} />
              <Route path=':id' element={<Location />} />
            </Route>

            <Route path={ROUTES.RUTAS}>
              <Route index element={<RoutesPage />} />
              <Route path=':id' element={<RoutePage />} />
            </Route>

            <Route path={ROUTES.FACTURAS}>
              <Route index element={<Invoices />} />
            </Route>

            <Route path={ROUTES.CLIENTES}>
              <Route index element={<Clients />} />
              <Route path=':id' element={<Client />} />
            </Route>

            <Route path={ROUTES.COLABORADORES}>
              <Route index element={<Drivers />} />
              <Route path=':id' element={<Driver />} />
            </Route>

            <Route path={ROUTES.UNIDADES}>
              <Route index element={<Units />} />
            </Route>

            <Route path={ROUTES.PERFIL} element={<Profile />} />
            <Route path={ROUTES.CONFIGURACION} element={<Settings />} />
            <Route path={ROUTES.AJUSTES_DE_EQUIPO} element={<TeamSettings />} />
          </Route>
        </Route>

        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}

export default Router
