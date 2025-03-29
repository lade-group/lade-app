import BaseHelpTour from './BaseHelpTour'
const ClientsPageTour = () => {
  const steps = [
    {
      element: '#clients-page',
      popover: {
        title: 'Bienvenido a la pagina de clientes',
        description:
          'Aqui podras Visualizar la informacion de tus clientes, ademas de poder editar los existentes, o crear nuevos desde cero.',
        side: 'left',
        align: 'start',
      },
    },
    {
      element: '#create-client-button',
      popover: {
        title: 'Aqui puedes Agregar tus usuarios',
        description:
          'Aqui podras Visualizar la informacion de tus clientes, ademas de poder Editar los existentes, o crear nuevos desde cero.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: 'table',
      popover: {
        title: 'Aqui puedes Agregar tus usuarios',
        description:
          'Aqui podras Visualizar la informacion de tus clientes, ademas de poder Editar los existentes, o crear nuevos desde cero.',
        side: 'top',
        align: 'start',
      },
    },
    {
      element: 'tbody tr:nth-child(1)',
      popover: {
        title: 'Aqui puedes Agregar tus usuarios',
        description:
          'Aqui podras Visualizar la informacion de tus clientes, ademas de poder Editar los existentes, o crear nuevos desde cero.',
        side: 'top',
        align: 'start',
      },
    },
  ]

  return <BaseHelpTour steps={steps} />
}

export default ClientsPageTour
