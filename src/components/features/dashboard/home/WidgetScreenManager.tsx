import { createSwapy, Swapy } from 'swapy'
import { useEffect, useRef, useState } from 'react'
import WidgetOptionsButtonMenu from './WidgetOptionsButtonMenu'
import AnimatedButtonGroup from '../../../ui/ButtonGroup/AnimatedButtonGroup'
import KPIWidget from '../../../ui/Widgets/KPIWidget'
import BarCharWidget from '../../../ui/Widgets/BarCharWidget'
import TableWidget from '../../../ui/Widgets/TableWidget'
import { Add } from '@mui/icons-material'
import AddWidgetModal from './AddWidgetModal'

const WidgetScreenManager = () => {
  const swapyRef = useRef<Swapy | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [widgets, setWidgets] = useState<Record<string, React.ReactNode>>({
    'a-1': <KPIWidget />,
    'b-1': <BarCharWidget />,
    d: <TableWidget />,
  })

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {
        animation: 'spring',
      })
      swapyRef.current.onBeforeSwap((event) => true)
    }
    return () => {
      swapyRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (swapyRef.current) {
      swapyRef.current.enable(isEditing)
    }
  }, [isEditing])

  const handleToggleEditing = () => {
    setIsEditing((prev) => !prev)
  }

  const handleSlotClick = (slotId: string) => {
    setSelectedSlot(slotId)
    setModalOpen(true)
  }

  const handleAddWidget = (widgetId: string, slotId: string) => {
    const widgetMap: Record<string, React.ReactNode> = {
      'kpi-1': <KPIWidget />,
      'kpi-2': <KPIWidget />,
      'kpi-3': <KPIWidget />,
      'chart-1': <BarCharWidget />,
      'chart-2': <BarCharWidget />,
      'table-1': <TableWidget />,
      'table-2': <TableWidget />,
    }
    setWidgets((prev) => ({ ...prev, [slotId]: widgetMap[widgetId] }))
  }

  const renderSlot = (slotId: string) => {
    const children = widgets[slotId]
    return (
      <div
        className={`h-full flex-1 rounded-lg relative ${
          isEditing ? 'border-2 border-primary/40 border-dashed' : ''
        }`}
        data-swapy-slot={slotId}
        onClick={() => isEditing && !children && handleSlotClick(slotId)}
      >
        {children}
        {isEditing && !children && (
          <div className='absolute inset-0 flex justify-center items-center'>
            <Add className='w-6 h-6 text-primary cursor-pointer' />
          </div>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className='flex justify-end gap-4 pb-4'>
        <AnimatedButtonGroup isEditing={isEditing} onToggleEditing={handleToggleEditing} />
        <WidgetOptionsButtonMenu onToggleEditing={handleToggleEditing} />
      </div>
      <div className='w-full flex flex-col gap-2 mx-auto' ref={containerRef}>
        <div className='h-30 flex gap-2'>
          {renderSlot('a-1')}
          {renderSlot('a-2')}
          {renderSlot('a-3')}
        </div>
        <div className='h-60 flex gap-2'>
          {renderSlot('b-1')}
          {renderSlot('b-2')}
        </div>
        <div className='h-60 flex gap-2'>
          {renderSlot('c-1')}
          {renderSlot('c-2')}
        </div>
        <div className='h-60 flex gap-2'>{renderSlot('d')}</div>
      </div>

      <AddWidgetModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddWidget}
        slotId={selectedSlot}
      />
    </div>
  )
}

export default WidgetScreenManager
