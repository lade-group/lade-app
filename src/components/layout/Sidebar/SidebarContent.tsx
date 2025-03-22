import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { Divider, Badge } from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ExpandLessIcon from '@mui/icons-material/ExpandLess'
import { routes } from '../../../constants/SidebarRoutes'

const SidebarContent = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean
  setIsCollapsed: any
}) => {
  const location = useLocation()
  const navigate = useNavigate()
  const [openMenus, setOpenMenus] = useState<string | null>(null)

  const toggleMenu = (menuLabel: string) => {
    setOpenMenus((prev) => (prev === menuLabel ? null : menuLabel))
  }

  const renderRoute = (route: any, index: number) => {
    if (route.type === 'header') {
      return (
        <Divider
          variant='middle'
          key={index}
          textAlign='left'
          className={` text-primary text-md px-4 py-1 `}
        >
          {isCollapsed ? '' : route.label}
        </Divider>
      )
    }

    if (route.type === 'tab') {
      return (
        <Link key={index} to={route.path}>
          <div
            className={`flex items-center px-3 py-2 m-2 rounded-lg text-lg font-semibold hover:bg-primary hover:text-secondary ${
              location.pathname === route.path ? 'bg-primary' : 'text-primary'
            }`}
          >
            {route.element}
            {
              <span
                className={`${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 delay-100'} ml-2 transition-opacity duration-300 opacity-0`}
              >
                {route.label}
              </span>
            }
            {route.badge && (
              <Badge badgeContent={route.badge} color='primary' className='ml-auto' />
            )}
          </div>
        </Link>
      )
    }

    if (route.type === 'menu') {
      return (
        <div key={index}>
          <div
            className='text-primary flex items-center justify-between px-3 py-2 m-2 rounded-lg text-lg font-semibold hover:bg-primary hover:text-secondary cursor-pointer'
            onClick={() => {
              toggleMenu(route.label)

              if (isCollapsed) {
                setIsCollapsed(!isCollapsed)
              }
            }}
          >
            <div className='flex items-center'>
              {route.element}
              {
                <span
                  className={`${isCollapsed ? 'opacity-0 ' : 'opacity-100 delay-100'} ml-2 transition-opacity duration-300`}
                >
                  {route.label}
                </span>
              }
            </div>
            <div
              className={`${isCollapsed ? 'opacity-0 hidden' : 'opacity-100 delay-500'} transition-opacity duration-300`}
            >
              {openMenus === route.label ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
          </div>
          {openMenus === route.label && !isCollapsed && (
            <div className='pl-8'>
              {route.children?.map((child: any, childIndex: number) =>
                renderRoute(child, childIndex)
              )}
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div
      className='flex flex-col h-full justify-between
'
    >
      <div>{routes.map((route, index) => renderRoute(route, index))}</div>
      <div>
        <Divider variant='middle' />
        <span
          onClick={() => navigate('/')}
          className='text-primary flex items-center px-4 py-2 m-2 rounded-lg text-lg font-semibold hover:bg-primary hover:text-secondary cursor-pointer'
        >
          <LogoutIcon />
          {!isCollapsed && <span className='ml-2'>Salir</span>}
        </span>
      </div>
    </div>
  )
}

export default SidebarContent
