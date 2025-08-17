import BaseHelpTour from './BaseHelpTour'

const VehiclePageTour = () => {
  const steps = [
    {
      element: '#vehicles-page',
      popover: {
        title: 'Bienvenido a la página de vehículos',
        description:
          'Aquí podrás visualizar la información de tus vehículos, además de poder editar los existentes, o crear nuevos desde cero.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: 'button:contains("Agregar Vehículo")',
      popover: {
        title: 'Aquí puedes agregar tus vehículos',
        description:
          'Haz clic en este botón para crear un nuevo vehículo con toda su información técnica, documentación y mantenimiento.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: '.p-inputtext',
      popover: {
        title: 'Buscar vehículos',
        description:
          'Utiliza esta barra de búsqueda para encontrar vehículos por placa, marca o modelo.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '.p-dropdown',
      popover: {
        title: 'Filtrar por estatus y tipo',
        description:
          'Filtra los vehículos por su estatus actual (Disponible, En Uso, Mantenimiento, etc.) y tipo de vehículo.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '.layout-toggle',
      popover: {
        title: 'Cambiar vista',
        description:
          'Alterna entre vista de lista y vista de tarjetas para mostrar los vehículos de diferentes maneras.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: '.vehicle-card',
      popover: {
        title: 'Tarjeta de vehículo',
        description:
          'Cada tarjeta muestra la imagen, placa, marca, modelo y estatus del vehículo. Haz clic para ver detalles completos.',
        side: 'top',
        align: 'start',
      },
    },
  ]

  return <BaseHelpTour steps={steps} />
}

export default VehiclePageTour
