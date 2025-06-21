import { RouteType } from '../types/routes'
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
  },
  {
    type: 'menu',
    label: 'Viajes',
    element: <PlaceIcon />,
    children: [
      {
        type: 'tab',
        label: 'Viajes',
        path: ROUTES.VIAJES,
        element: <SignpostIcon />,
      },
      {
        type: 'tab',
        label: 'Rutas',
        path: ROUTES.RUTAS,
        element: <AddRoadIcon />,
      },
      {
        type: 'tab',
        label: 'Locaciones',
        path: ROUTES.LOCACIONES,
        element: <PlaceIcon />,
      },
      {
        type: 'tab',
        label: 'Facturas',
        path: ROUTES.FACTURAS,
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
    path: ROUTES.COLABORADORES,
  },

  {
    type: 'tab',
    label: 'Unidades',
    element: <LocalShippingIcon />,
    path: ROUTES.UNIDADES,
  },

  {
    type: 'header',
    label: 'Admin',
  },
  {
    type: 'tab',
    label: 'Usuarios',
    path: ROUTES.USUSARIOS,
    element: <GroupsIcon />,
  },

  {
    type: 'tab',
    label: 'Ajustes Equipo',
    path: ROUTES.AJUSTES_DE_EQUIPO,
    element: <ManageAccountsIcon />,
  },
  // {
  //   type: 'menu',
  //   label: 'Suscripcion',
  //   element: <PaymentsIcon />,
  //   children: [
  //     {
  //       type: 'tab',
  //       label: 'Tu suscripcion',
  //       path: ROUTES.TU_SUSCRIPCION,
  //       element: <VerifiedIcon />,
  //     },
  //     {
  //       type: 'tab',
  //       label: 'Historial de pagos',
  //       path: ROUTES.HISTORIAL_DE_PAGOS,
  //       element: <HistoryIcon />,
  //     },
  //   ],
  // },
  {
    type: 'tab',
    label: 'Historial',
    path: ROUTES.HISTORIAL,
    element: <WorkHistoryIcon />,
  },
]
