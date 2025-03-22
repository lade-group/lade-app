import { createSwapy, Swapy } from 'swapy'
import { useEffect, useRef, useState } from 'react'
import WidgetOptionsButtonMenu from './WidgetOptionsButtonMenu'
import AnimatedButtonGroup from '../../../ui/ButtonGroup/AnimatedButtonGroup'
import KPIWidget from '../../../ui/Widgets/KPIWidget'
import BarCharWidget from '../../../ui/Widgets/BarCharWidget'
import TableWidget from '../../../ui/Widgets/TableWidget'

const WidgetScreenManager = () => {
  const swapyRef = useRef<Swapy | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {
        animation: 'spring',
        // swapMode: 'drop',
        // autoScrollOnDrag: true,
        // enabled: true,
        // dragAxis: 'x',
        // dragOnHold: true
      })

      // swapyRef.current.enable(false)
      // swapyRef.current.destroy()
      // console.log(swapyRef.current.slotItemMap())

      swapyRef.current.onBeforeSwap((event) => {
        console.log('beforeSwap', event)
        // This is for dynamically enabling and disabling swapping.
        // Return true to allow swapping, and return false to prevent swapping.
        return true
      })
    }

    return () => {
      swapyRef.current?.destroy()
    }
  }, [])

  // Cada vez que cambie el estado isEditing, habilitamos o deshabilitamos swapy
  useEffect(() => {
    if (swapyRef.current) {
      swapyRef.current.enable(isEditing)
    }
  }, [isEditing])

  // Función para alternar el estado de edición
  const handleToggleEditing = () => {
    setIsEditing((prev) => !prev)
  }

  return (
    <div>
      <div className='flex justify-end gap-4 pb-4'>
        <AnimatedButtonGroup isEditing={isEditing} onToggleEditing={handleToggleEditing} />
        <WidgetOptionsButtonMenu onToggleEditing={handleToggleEditing} />
      </div>
      <div className=' w-full flex flex-col gap-2 mx-auto' ref={containerRef}>
        <div className='h-30 flex gap-2'>
          <div
            className={
              `h-full flex-1 rounded-lg ` +
              (isEditing ? 'border-2 border-primary/40 border-dashed' : '')
            }
            data-swapy-slot='a-1'
          >
            <KPIWidget />
          </div>
          <div
            className={
              `h-full flex-1 rounded-lg ` +
              (isEditing ? 'border-2 border-primary/40 border-dashed' : '')
            }
            data-swapy-slot='a-2'
          ></div>
          <div
            className={
              `h-full flex-1 rounded-lg ` +
              (isEditing ? 'border-2 border-primary/40 border-dashed' : '')
            }
            data-swapy-slot='a-3'
          ></div>
        </div>

        <div className=' h-60 flex gap-2'>
          <div
            className={
              `h-full flex-1 rounded-lg ` +
              (isEditing ? 'border-2 border-primary/40 border-dashed' : '')
            }
            data-swapy-slot='b-1'
          >
            <BarCharWidget />
          </div>
          <div
            className={
              `h-full flex-1 rounded-lg ` +
              (isEditing ? 'border-2 border-primary/40 border-dashed' : '')
            }
            data-swapy-slot='b-2'
          ></div>
        </div>

        <div className=' h-60 flex gap-2'>
          <div
            className={
              `h-full flex-1 rounded-lg ` +
              (isEditing ? 'border-2 border-primary/40 border-dashed' : '')
            }
            data-swapy-slot='c-1'
          ></div>
          <div
            className={
              `h-full flex-1 rounded-lg ` +
              (isEditing ? 'border-2 border-primary/40 border-dashed' : '')
            }
            data-swapy-slot='c-2'
          ></div>
        </div>

        <div className=' h-60 flex gap-2'>
          <div
            className={
              `h-full flex-1 rounded-lg ` +
              (isEditing ? 'border-2 border-primary/40 border-dashed' : '')
            }
            data-swapy-slot='d'
          >
            <TableWidget />
          </div>
        </div>
      </div>
    </div>
  )
}

export default WidgetScreenManager
