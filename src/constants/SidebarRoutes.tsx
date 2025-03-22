import { RouteType } from '../types/routes'
import { ROUTES } from '../constants/routes'

import GroupsIcon from '@mui/icons-material/Groups'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import HomeIcon from '@mui/icons-material/Home'
import BadgeIcon from '@mui/icons-material/Badge'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import SignpostIcon from '@mui/icons-material/Signpost'
import HandshakeIcon from '@mui/icons-material/Handshake'
import HistoryIcon from '@mui/icons-material/History'
import PlaceIcon from '@mui/icons-material/Place'
import AddRoadIcon from '@mui/icons-material/AddRoad'
import ReceiptIcon from '@mui/icons-material/Receipt'
import PaymentsIcon from '@mui/icons-material/Payments'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
import VerifiedIcon from '@mui/icons-material/Verified'
import CarCrashIcon from '@mui/icons-material/CarCrash'
import ElectricRickshawIcon from '@mui/icons-material/ElectricRickshaw'

export const routes: RouteType[] = [
  {
    type: 'tab',
    label: 'Inicio',
    path: ROUTES.INICIO,
    element: <HomeIcon />,
  },
  {
    type: 'menu',
    label: 'Viajes',
    element: <PlaceIcon />,
    children: [
      {
        type: 'tab',
        label: 'Lista de Viajes',
        path: '/dashboard/all-employees',
        element: <GroupsIcon />,
      },
      {
        type: 'tab',
        label: 'Facturas Viajes',
        path: '/dashboard/add-employees',
        element: <ReceiptIcon />,
      },
    ],
  },
  {
    type: 'tab',
    label: 'Clientes',
    element: <HandshakeIcon />,
    path: ROUTES.CLIENTES,
  },

  {
    type: 'tab',
    label: 'Colaboradores',
    element: <BadgeIcon />,
    path: '/dashboard/colaboradores',
  },

  {
    type: 'menu',
    label: 'Unidades',
    element: <LocalShippingIcon />,
    children: [
      {
        type: 'tab',
        label: 'Unidades',
        path: '/dashboard/all-employees',
        element: <ElectricRickshawIcon />,
      },
      {
        type: 'tab',
        label: 'Tipos de unidades',
        path: '/dashboard/add-employees',
        element: <CarCrashIcon />,
      },
    ],
  },
  {
    type: 'menu',
    label: 'Rutas',
    element: <SignpostIcon />,
    children: [
      {
        type: 'tab',
        label: 'Rutas',
        path: '/dashboard/routes',
        element: <AddRoadIcon />,
      },
      {
        type: 'tab',
        label: 'Locaciones',
        path: '/dashboard/locations',
        element: <PlaceIcon />,
      },
    ],
  },

  {
    type: 'header',
    label: 'Admin',
  },
  {
    type: 'tab',
    label: 'Usuarios',
    path: '/dashboard/all-users',
    element: <GroupsIcon />,
  },

  {
    type: 'tab',
    label: 'Ajustes Equipo',
    path: '/dashboard/settings-teams',
    element: <ManageAccountsIcon />,
  },
  {
    type: 'menu',
    label: 'Suscripcion',
    element: <PaymentsIcon />,
    children: [
      {
        type: 'tab',
        label: 'Tu suscripcion',
        path: '/dashboard/my-suscription',
        element: <VerifiedIcon />,
      },
      {
        type: 'tab',
        label: 'Historial de pagos',
        path: '/dashboard/payment-logs',
        element: <HistoryIcon />,
      },
    ],
  },
  {
    type: 'tab',
    label: 'Historial',
    path: '/dashboard/logs',
    element: <WorkHistoryIcon />,
  },
]
