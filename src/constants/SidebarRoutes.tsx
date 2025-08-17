import { RouteType, UserRole } from '../types/routes'
import { ROUTES } from '../constants/routes'

import GroupsIcon from '@mui/icons-material/Groups'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import HomeIcon from '@mui/icons-material/Home'
import BadgeIcon from '@mui/icons-material/Badge'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'
import SignpostIcon from '@mui/icons-material/Signpost'
import HandshakeIcon from '@mui/icons-material/Handshake'
import PlaceIcon from '@mui/icons-material/Place'
import AddRoadIcon from '@mui/icons-material/AddRoad'
import ReceiptIcon from '@mui/icons-material/Receipt'
import WorkHistoryIcon from '@mui/icons-material/WorkHistory'
// import HistoryIcon from '@mui/icons-material/History'
// import PaymentsIcon from '@mui/icons-material/Payments'
// import VerifiedIcon from '@mui/icons-material/Verified'

export const routes: RouteType[] = [
  {
    type: 'tab',
    label: 'Inicio',
    path: ROUTES.INICIO,
    element: <HomeIcon />,
    roles: ['ADMIN', 'USER', 'OWNER'],
  },
  {
    type: 'menu',
    label: 'Viajes',
    element: <PlaceIcon />,
    roles: ['ADMIN', 'USER', 'OWNER'],
    children: [
      {
        type: 'tab',
        label: 'Viajes',
        path: ROUTES.VIAJES,
        element: <SignpostIcon />,
        roles: ['ADMIN', 'USER', 'OWNER'],
      },
      {
        type: 'tab',
        label: 'Rutas',
        path: ROUTES.RUTAS,
        element: <AddRoadIcon />,
        roles: ['ADMIN', 'USER', 'OWNER'],
      },
      {
        type: 'tab',
        label: 'Locaciones',
        path: ROUTES.LOCACIONES,
        element: <PlaceIcon />,
        roles: ['ADMIN', 'USER', 'OWNER'],
      },
      {
        type: 'tab',
        label: 'Facturas',
        path: ROUTES.FACTURAS,
        element: <ReceiptIcon />,
        roles: ['ADMIN', 'USER', 'OWNER'],
      },
    ],
  },
  {
    type: 'tab',
    label: 'Clientes',
    element: <HandshakeIcon />,
    path: ROUTES.CLIENTES,
    roles: ['ADMIN', 'USER', 'OWNER'],
  },
  {
    type: 'tab',
    label: 'Colaboradores',
    element: <BadgeIcon />,
    path: ROUTES.COLABORADORES,
    roles: ['ADMIN', 'USER', 'OWNER'],
  },
  {
    type: 'tab',
    label: 'Unidades',
    element: <LocalShippingIcon />,
    path: ROUTES.UNIDADES,
    roles: ['ADMIN', 'USER', 'OWNER'],
  },
  {
    type: 'header',
    label: 'Admin',
    roles: ['ADMIN', 'OWNER'],
  },
  {
    type: 'tab',
    label: 'Usuarios',
    path: ROUTES.USUSARIOS,
    element: <GroupsIcon />,
    roles: ['ADMIN', 'OWNER'],
  },
  {
    type: 'tab',
    label: 'Ajustes Equipo',
    path: ROUTES.AJUSTES_DE_EQUIPO,
    element: <ManageAccountsIcon />,
    roles: ['ADMIN', 'OWNER'],
  },
  // {
  //   type: 'menu',
  //   label: 'Suscripcion',
  //   element: <PaymentsIcon />,
  //   roles: ['ADMIN', 'USER', 'OWNER'],
  //   children: [
  //     {
  //       type: 'tab',
  //       label: 'Tu suscripcion',
  //       path: ROUTES.TU_SUSCRIPCION,
  //       element: <VerifiedIcon />,
  //       roles: ['ADMIN', 'USER', 'OWNER'],
  //     },
  //     {
  //       type: 'tab',
  //       label: 'Historial de pagos',
  //       path: ROUTES.HISTORIAL_DE_PAGOS,
  //       element: <HistoryIcon />,
  //       roles: ['ADMIN', 'USER', 'OWNER'],
  //     },
  //   ],
  // },
  {
    type: 'tab',
    label: 'Historial',
    path: ROUTES.HISTORIAL,
    element: <WorkHistoryIcon />,
    roles: ['ADMIN', 'OWNER'],
  },
]

// Función para filtrar rutas según el rol del usuario
export const filterRoutesByRole = (routes: RouteType[], userRole: UserRole): RouteType[] => {
  return routes
    .map((route) => {
      // Si la ruta no tiene roles definidos, permitir acceso
      if (!route.roles) {
        return route
      }

      // Si el usuario tiene el rol requerido
      if (route.roles.includes(userRole)) {
        // Si tiene hijos, filtrar también los hijos
        if (route.children) {
          return {
            ...route,
            children: filterRoutesByRole(route.children, userRole),
          }
        }
        return route
      }

      // Si no tiene el rol requerido, no mostrar la ruta
      return null
    })
    .filter((route): route is RouteType => route !== null)
}
