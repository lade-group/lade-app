import BaseHelpTour from './BaseHelpTour'

const DriverPageTour = () => {
  const steps = [
    {
      element: '#drivers-page',
      popover: {
        title: 'Bienvenido a la página de conductores',
        description:
          'Aquí podrás visualizar la información de tus conductores, además de poder editar los existentes, o crear nuevos desde cero.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#create-driver-button',
      popover: {
        title: 'Aquí puedes agregar tus conductores',
        description:
          'Haz clic en este botón para crear un nuevo conductor con toda su información personal, laboral y documentación.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '#driver-search',
      popover: {
        title: 'Buscar conductores',
        description:
          'Utiliza esta barra de búsqueda para encontrar conductores por nombre, número de licencia, CURP o RFC.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#driver-filters',
      popover: {
        title: 'Filtrar por estatus',
        description:
          'Filtra los conductores por su estatus actual: Disponible, En Viaje o Desactivado.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '#driver-layout-toggle',
      popover: {
        title: 'Cambiar vista',
        description:
          'Alterna entre vista de lista y vista de tarjetas para mostrar los conductores de diferentes maneras.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '.driver-card',
      popover: {
        title: 'Tarjeta de conductor',
        description:
          'Cada tarjeta muestra la foto, nombre, número de licencia y estatus del conductor. Haz clic para ver detalles.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '.driver-actions',
      popover: {
        title: 'Acciones rápidas',
        description:
          'Desde aquí puedes editar o desactivar conductores directamente sin entrar a su perfil completo.',
        side: 'left',
        align: 'start',
      },
    },
  ]

  return <BaseHelpTour steps={steps} />
}

export default DriverPageTour
