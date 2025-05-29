import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Grid,
  Typography,
  Paper,
} from '@mui/material'
import { Add, BarChart, TableChart, ShowChart } from '@mui/icons-material'
import { Fragment, JSX, useState } from 'react'

interface WidgetType {
  type: 'KPI' | 'CHART' | 'TABLE'
  items: {
    id: string
    label: string
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
      { id: 'kpi-1', label: 'Clientes activos' },
      { id: 'kpi-2', label: 'Conductores disponibles' },
      { id: 'kpi-3', label: 'Vehículos en mantenimiento' },
    ],
  },
  {
    type: 'CHART',
    items: [
      { id: 'chart-1', label: 'Viajes por mes' },
      { id: 'chart-2', label: 'Combustible usado por semana' },
    ],
  },
  {
    type: 'TABLE',
    items: [
      { id: 'table-1', label: 'Listado de clientes' },
      { id: 'table-2', label: 'Historial de viajes' },
    ],
  },
]

const iconMap: Record<string, JSX.Element> = {
  KPI: <ShowChart color='primary' fontSize='small' />,
  CHART: <BarChart color='primary' fontSize='small' />,
  TABLE: <TableChart color='primary' fontSize='small' />,
}

const AddWidgetModal = ({ isOpen, onClose, onAdd, slotId }: AddWidgetModalProps) => {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth='md'>
      <DialogTitle className='text-primary text-2xl font-semibold'>Agregar Widget</DialogTitle>
      <DialogContent>
        {dummyWidgets.map((group) => (
          <div key={group.type} className='mb-6'>
            <Typography variant='h6' className='flex items-center gap-2 text-gray-700 mb-2'>
              {iconMap[group.type]} {group.type}
            </Typography>
            <Grid container spacing={2}>
              {group.items.map((item) => (
                <Grid item xs={6} md={4} key={item.id}>
                  <Paper
                    className='flex justify-between items-center p-3 cursor-pointer hover:border-primary border transition-all border-gray-200 rounded-md shadow-sm'
                    onClick={() => {
                      if (slotId) {
                        setSelectedId(item.id)
                        onAdd(item.id, slotId)
                        onClose()
                      }
                    }}
                  >
                    <Typography className='text-sm text-gray-800'>{item.label}</Typography>
                    <Add fontSize='small' color='primary' />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </div>
        ))}
      </DialogContent>
    </Dialog>
  )
}

export default AddWidgetModal
