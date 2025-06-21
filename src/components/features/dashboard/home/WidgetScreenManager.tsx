import { createSwapy, Swapy } from 'swapy'
import { cloneElement, useEffect, useRef, useState } from 'react'
import WidgetOptionsButtonMenu from './WidgetOptionsButtonMenu'
import AnimatedButtonGroup from '../../../ui/ButtonGroup/AnimatedButtonGroup'
import KPIWidget from '../../../ui/Widgets/KPI/KPIWidget'
import BarCharWidget from '../../../ui/Widgets/Charts/BarCharWidget'
import LineChartWidget from '../../../ui/Widgets/Charts/LineChartWidget'
import DoughnutChartWidget from '../../../ui/Widgets/Charts/DoughnutChartWidget'
import TableWidget from '../../../ui/Widgets/DataViews/TableWidget'
import AddWidgetModal from './AddWidgetModal'
import AddWidgetPlaceholder from './AddWidgetPlaceholder'

const WidgetScreenManager = () => {
  const swapyRef = useRef<Swapy | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  const [widgets, setWidgets] = useState<Record<string, React.ReactNode>>({
    'a-1': <KPIWidget onRemove={() => {}} editable={false} />,
    'b-1': <LineChartWidget onRemove={() => {}} editable={false} />,
    d: <TableWidget onRemove={() => {}} editable={false} />,
  })

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {
        animation: 'spring',
      })
      swapyRef.current.enable(isEditing)
    }
    return () => swapyRef.current?.destroy()
  }, [])

  useEffect(() => {
    swapyRef.current?.enable(isEditing)
  }, [isEditing])

  const handleToggleEditing = () => setIsEditing((prev) => !prev)

  const handleSlotClick = (slotId: string) => {
    setSelectedSlot(slotId)
    setModalOpen(true)
  }

  const handleAddWidget = (widgetId: string, slotId: string) => {
    const handleRemove = () => {
      setWidgets((prev) => {
        const updated = { ...prev }
        delete updated[slotId]
        return updated
      })
    }

    const props = { onRemove: handleRemove, editable: isEditing }

    const widgetMap: Record<string, React.ReactNode> = {
      'kpi-1': <KPIWidget {...props} />,
      'kpi-2': <KPIWidget {...props} />,
      'kpi-3': <KPIWidget {...props} />,
      'chart-1': <BarCharWidget {...props} />,
      'chart-2': <BarCharWidget {...props} />,
      'chart-3': <LineChartWidget {...props} />,
      'chart-4': <DoughnutChartWidget {...props} />,
      'table-1': <TableWidget {...props} />,
      'table-2': <TableWidget {...props} />,
    }
    setWidgets((prev) => ({ ...prev, [slotId]: widgetMap[widgetId] }))
  }

  const renderSlot = (slotId: string) => {
    const widget = widgets[slotId]

    const handleRemove = () => {
      setWidgets((prev) => {
        const updated = { ...prev }
        delete updated[slotId]
        return updated
      })
    }

    const props = { onRemove: handleRemove, editable: isEditing }

    return (
      <div className='h-full w-full relative' data-swapy-slot={slotId}>
        <div data-swapy-item={slotId} className='h-full w-full'>
          {widget ? (
            cloneElement(widget as any, props)
          ) : (
            <AddWidgetPlaceholder isEditing={isEditing} onClick={() => handleSlotClick(slotId)} />
          )}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className='flex justify-end gap-4 pb-4'>
        <AnimatedButtonGroup isEditing={isEditing} onToggleEditing={handleToggleEditing} />
        <WidgetOptionsButtonMenu onToggleEditing={handleToggleEditing} />
      </div>
      <div className='w-full flex flex-col gap-6 mx-auto' ref={containerRef}>
        <div className='h-1/4 w-full grid grid-cols-1 sm:grid-cols-4 gap-2'>
          {renderSlot('a-1')}
          {renderSlot('a-2')}
          {renderSlot('a-3')}
          {renderSlot('a-4')}
        </div>
        <div className='h-1/4 w-full grid grid-cols-1 sm:grid-cols-2 gap-2'>
          {renderSlot('b-1')}
          {renderSlot('b-2')}
        </div>
        <div className='h-1/4 w-full grid grid-cols-1 sm:grid-cols-2 gap-2'>
          {renderSlot('c-1')}
          {renderSlot('c-2')}
        </div>
        <div className='h-1/4 w-full grid grid-cols-1 gap-2'>{renderSlot('d')}</div>
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
