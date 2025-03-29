export const ROUTES = {
  // Home Route
  INICIO: '/dashboard',

  // Clientes Route
  CLIENTES: '/dashboard/clients',

  // Routes Drivers
  COLABORADORES: '/dashboard/colaboradores',

  // Routes Related to Trips
  VIAJES: '/dashboard/trips',
  RUTAS: '/dashboard/routes',
  LOCACIONES: '/dashboard/locations',
  FACTURAS: '/dashboard/invoices',

  // Routes for Units
  UNIDADES: '/dashboard/all-units',

  // Admin Routes
  AJUSTES_DE_EQUIPO: '/dashboard/settings-teams',
  USUSARIOS: '/dashboard/all-users',
  TU_SUSCRIPCION: '/dashboard/my-suscription',
  HISTORIAL_DE_PAGOS: '/dashboard/payment-logs',
  HISTORIAL: '/dashboard/logs',

  // Related Profiles Routes
  PERFIL: '/dashboard/profile',
  CONFIGURACION: '/dashboard/settings',
} as const
