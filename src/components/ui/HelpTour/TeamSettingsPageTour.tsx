import BaseHelpTour from './BaseHelpTour'

const TeamSettingsPageTour = () => {
  const steps = [
    {
      element: '#team-settings-page',
      popover: {
        title: 'Ajustes de Equipo',
        description: 'Aquí puedes gestionar toda la información de tu empresa y equipo.',
        side: 'bottom',
        align: 'start',
      },
    },
    {
      element: 'button:contains("Editar")',
      popover: {
        title: 'Editar Información',
        description:
          'Haz clic aquí para editar la información del equipo, incluyendo nombre, logo y código de unión.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: 'button:contains("Desactivar")',
      popover: {
        title: 'Desactivar Equipo',
        description:
          'Como propietario, puedes desactivar el equipo. Esto lo ocultará pero mantendrá todos los datos.',
        side: 'left',
        align: 'center',
      },
    },
    {
      element: '.team-logo',
      popover: {
        title: 'Logo del Equipo',
        description: 'Aquí se muestra el logo de tu empresa. Puedes cambiarlo en modo edición.',
        side: 'right',
        align: 'center',
      },
    },
    {
      element: 'strong:contains("Estado")',
      popover: {
        title: 'Estado del Equipo',
        description: 'Muestra si el equipo está activo, inactivo o suspendido.',
        side: 'top',
        align: 'center',
      },
    },

    {
      element: 'div:contains("Información de Dirección")',
      popover: {
        title: 'Información de Dirección',
        description: 'Aquí puedes ver la dirección completa de la empresa.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: 'div:contains("Miembros del Equipo")',
      popover: {
        title: 'Miembros del Equipo',
        description: 'Lista de todos los usuarios que pertenecen al equipo y sus roles.',
        side: 'top',
        align: 'center',
      },
    },
    {
      element: 'div:contains("Documentos del Equipo")',
      popover: {
        title: 'Documentos del Equipo',
        description: 'Sube y gestiona documentos importantes de la empresa.',
        side: 'top',
        align: 'center',
      },
    },
  ]

  return <BaseHelpTour steps={steps} />
}

export default TeamSettingsPageTour
