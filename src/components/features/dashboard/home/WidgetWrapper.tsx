import { ReactNode } from 'react'
import { Menu } from 'primereact/menu'
import { useRef } from 'react'

interface Props {
  children: ReactNode
  onRemove: () => void
  editable?: boolean
}

const WidgetWrapper = ({ children, onRemove, editable = true }: Props) => {
  const menuRef = useRef<any>(null)

  const items = [
    {
      label: 'Eliminar',
      icon: 'pi pi-trash',
      command: onRemove,
    },
  ]

  return (
    <div className='h-full w-full  rounded-lg relative'>
      {editable && (
        <div className='absolute top-2 right-2 z-10'>
          <Menu model={items} popup ref={menuRef} />
          <button
            onClick={(e) => menuRef.current?.toggle(e)}
            className='text-gray-500 hover:text-primary'
          >
            <i className='pi pi-ellipsis-v' />
          </button>
        </div>
      )}
      <div className='h-full w-full'>{children}</div>
    </div>
  )
}

export default WidgetWrapper
