import { useState, MouseEvent } from 'react'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { IconButton, Menu, MenuItem } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'

interface WidgetOptionsButtonMenuProps {
  onToggleEditing: () => void
}

const WidgetOptionsButtonMenu: React.FC<WidgetOptionsButtonMenuProps> = ({ onToggleEditing }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseWithOption = () => {
    onToggleEditing()
    setAnchorEl(null)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <div>
      <IconButton
        id='options-button'
        aria-controls={open ? 'options-menu' : undefined}
        aria-haspopup='true'
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        <MoreVertIcon className='text-primary' />
      </IconButton>
      <Menu
        id='options-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleCloseWithOption}>
          <EditIcon style={{ marginRight: 8 }} className='text-primary' />
          <span className='text-primary'>Editar Widgets</span>
        </MenuItem>
      </Menu>
    </div>
  )
}

export default WidgetOptionsButtonMenu
