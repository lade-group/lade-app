import { Dialog } from 'primereact/dialog'
import { Card } from 'primereact/card'
import { Add, BarChart, TableChart, ShowChart, Close } from '@mui/icons-material'
import { JSX, useState } from 'react'
import kpi from '../../../../assets/images/kpi.png'
import line from '../../../../assets/images/lineas.png'
import bar from '../../../../assets/images/barras.png'
import table from '../../../../assets/images/tabla.png'

interface WidgetType {
  type: 'KPI' | 'CHART' | 'TABLE'
  items: {
    id: string
    label: string
    img: string
  }[]
}

interface AddWidgetModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: (widgetId: string, slotId: string) => void
  slotId: string | null
}

const dummyWidgets: WidgetType[] = [
  {
    type: 'KPI',
    items: [
      { id: 'kpi-1', label: 'Clientes activos', img: kpi },
      { id: 'kpi-2', label: 'Conductores disponibles', img: kpi },
      { id: 'kpi-3', label: 'Vehículos en mantenimiento', img: kpi },
    ],
  },
  {
    type: 'CHART',
    items: [
      { id: 'chart-1', label: 'Viajes por mes', img: bar },
      { id: 'chart-2', label: 'Combustible usado por semana', img: bar },
      { id: 'chart-3', label: 'Ventas mensuales (Línea)', img: line },
    ],
  },
  {
    type: 'TABLE',
    items: [
      { id: 'table-1', label: 'Listado de clientes', img: table },
      { id: 'table-2', label: 'Historial de viajes', img: table },
    ],
  },
]

const iconMap: Record<string, JSX.Element> = {
  KPI: <ShowChart className='text-primary' fontSize='large' />,
  CHART: <BarChart className='text-primary' fontSize='large' />,
  TABLE: <TableChart className='text-primary' fontSize='large' />,
}

const AddWidgetModal = ({ isOpen, onClose, onAdd, slotId }: AddWidgetModalProps) => {
  const [_, setSelectedId] = useState<string | null>(null)

  return (
    <Dialog
      visible={isOpen}
      onHide={onClose}
      style={{ width: '50vw' }}
      content={({ hide }) => (
        <div className='bg-white rounded-2xl overflow-y-scroll'>
          <div className='pb-2 pt-8 px-6  flex flex-row justify-between'>
            <span className='text-2xl font-semibold text-primary'>Agregar Widget</span>
            <div onClick={(e) => hide(e)}>
              <Close
                className='text-primary-hover hover:text-gray-400 cursor-pointer flex flex-row items-end justify-end'
                fontSize='large'
              />
            </div>
          </div>
          <div className='p-6 space-y-8'>
            {dummyWidgets.map((group) => (
              <div key={group.type}>
                <h3 className='text-xl font-semibold text-gray-700 flex items-center gap-2 mb-3'>
                  {iconMap[group.type]} {group.type}
                </h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
                  {group.items.map((item) => (
                    <Card
                      key={item.id}
                      className='cursor-pointer hover:ring-2 ring-primary transition-all'
                      onClick={() => {
                        if (slotId) {
                          setSelectedId(item.id)
                          onAdd(item.id, slotId)
                          onClose()
                        }
                      }}
                    >
                      <div className='flex flex-col gap-2'>
                        <img
                          src={item.img}
                          alt={item.label}
                          className='rounded-md h-50 object-fill'
                        />
                        <div className='flex justify-between items-center px-2'>
                          <span className='text-sm text-gray-800 py-5'>{item.label}</span>
                          <Add fontSize='small' className='text-primary' />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    ></Dialog>
  )
}

export default AddWidgetModal
