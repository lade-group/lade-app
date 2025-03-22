import { IconButton, Avatar, Badge } from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'

import NavigationSearchBar from './NavigationSearchBar'
import AvatarMenuButton from './AvatarMenuButton'

const Header = ({ isCollapsed }: { isCollapsed: boolean }) => {
  return (
    <header
      className={`${isCollapsed ? 'left-[4rem] delay-200' : 'left-[16rem]'} fixed top-0 right-0 h-16 bg-secondary  flex items-center z-10 transition-all duration-300`}
    >
      <div className='flex-grow '>
        <NavigationSearchBar />
      </div>

      <div className='flex items-center gap-4 px-10'>
        <IconButton>
          <Badge badgeContent={3} color='error'>
            <NotificationsIcon className='text-primary' />
          </Badge>
        </IconButton>
        <AvatarMenuButton />
      </div>
    </header>
  )
}

export default Header
