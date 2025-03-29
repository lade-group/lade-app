import { useLocation, Link } from 'react-router'
import Typography from '@mui/material/Typography'
import Breadcrumbs from '@mui/material/Breadcrumbs'

function DynamicBreadcrumbs() {
  const location = useLocation() // Obtenemos la ubicación actual de la URL
  const pathnames = location.pathname.split('/').filter((x) => x) // Separamos la URL en partes

  // Crear un array de objetos para cada parte de la URL
  const breadcrumbItems = pathnames.map((value, index) => {
    const url = `/${pathnames.slice(0, index + 1).join('/')}` // Construimos el URL para esa sección
    return { label: value.charAt(0).toUpperCase() + value.slice(1), url } // Capitalizamos la primera letra
  })

  return (
    <div role='presentation'>
      <Breadcrumbs aria-label='breadcrumb'>
        {breadcrumbItems.slice(0, breadcrumbItems.length - 1).map((item, index) => (
          <Link key={index} color='inherit' to={item.url}>
            {item.label}
          </Link>
        ))}
        <Typography sx={{ color: 'text.primary' }}>
          {breadcrumbItems[breadcrumbItems.length - 1]?.label}
        </Typography>
      </Breadcrumbs>
    </div>
  )
}

export default DynamicBreadcrumbs
