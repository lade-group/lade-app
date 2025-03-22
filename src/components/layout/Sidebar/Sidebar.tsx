import SidebarContent from './SidebarContent'
import { IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

const Sidebar = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean
  setIsCollapsed: (value: boolean) => void
}) => {
  return (
    <div
      className={`bg-secondary text-gray-300 h-screen ${
        isCollapsed ? 'w-16 delay-200' : 'w-64'
      } flex flex-col fixed transition-all duration-300`}
    >
      {/* Header */}
      <div className='px-3 pt-2 flex justify-start'>
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <MenuIcon className='text-primary' />
        </IconButton>
      </div>
      <div className='pt-4 pb-8 flex justify-center gap-1'>
        {!isCollapsed && (
          <>
            <h2 className='text-primary text-3xl font-semibold '>LADE</h2>
          </>
        )}
        <div className='flex items-end'>
          <LocalShippingIcon className='text-primary' fontSize='large' />
        </div>
      </div>

      {/* Sidebar Content */}
      <SidebarContent isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
    </div>
  )
}

export default Sidebar
