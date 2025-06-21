import { useRef } from 'react'
import { Menu } from 'primereact/menu'
import { Button } from 'primereact/button'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import EditIcon from '@mui/icons-material/Edit'
import { MenuItem } from 'primereact/menuitem'

interface WidgetOptionsButtonMenuProps {
  onToggleEditing: () => void
}

const WidgetOptionsButtonMenu: React.FC<WidgetOptionsButtonMenuProps> = ({ onToggleEditing }) => {
  const menuRef = useRef<Menu>(null)

  const items: MenuItem[] = [
    {
      label: 'Editar Widgets',
      icon: <EditIcon className='text-primary mr-2' />,
      command: () => {
        onToggleEditing()
      },
    },
  ]

  return (
    <div>
      <button
        onClick={(e) => menuRef.current?.toggle(e)}
        className='p-2 bg-transparent border-none rounded-full hover:bg-gray-100 cursor-pointer'
      >
        <MoreVertIcon className='text-primary' />
      </button>

      <Menu model={items} popup ref={menuRef} id='options-menu' className='' />
    </div>
  )
}

export default WidgetOptionsButtonMenu
