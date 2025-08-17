import { useState, MouseEvent } from 'react'
import { Avatar, IconButton, Menu, MenuItem } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import GroupsIcon from '@mui/icons-material/Groups'

import { useNavigate } from 'react-router'
import { ROUTES } from '../../../constants/routes'
import { useAuth } from '../../../core/contexts/AuthContext'
import placeholderImage from '../../../assets/images/placeholder.jpg'

const AvatarMenuButton = () => {
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handlePath = (path: string) => {
    navigate(path)
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        id='avatar-button'
        aria-controls={open ? 'avatar-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <Avatar
          src={currentUser?.photoUrl}
          sx={{
            width: 40,
            height: 40,
            bgcolor: currentUser?.photoUrl ? 'transparent' : 'primary.main',
          }}
        ></Avatar>
      </IconButton>
      <Menu
        id='avatar-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={() => handlePath(ROUTES.PERFIL)}>
          <PersonIcon style={{ marginRight: 8 }} className='text-primary' />
          <span className='text-primary'>Perfil</span>
        </MenuItem>
        <MenuItem onClick={() => handlePath('/equipos')}>
          <GroupsIcon style={{ marginRight: 8 }} className='text-primary' />
          <span className='text-primary'>Cambiar de Equipo</span>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default AvatarMenuButton
