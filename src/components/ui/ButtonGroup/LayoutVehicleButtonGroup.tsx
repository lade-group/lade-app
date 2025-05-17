// components/ui/LayoutToggle.tsx
import { SelectButton } from 'primereact/selectbutton'
import ViewListIcon from '@mui/icons-material/ViewList'
import ViewModuleIcon from '@mui/icons-material/ViewModule'
import { ReactNode } from 'react'

interface LayoutToggleProps {
  layout: 'grid' | 'list'
  onChange: (layout: 'grid' | 'list') => void
}

const options: { label: ReactNode; value: 'grid' | 'list' }[] = [
  { label: <ViewListIcon fontSize='small' />, value: 'list' },
  { label: <ViewModuleIcon fontSize='small' />, value: 'grid' },
]

const LayoutToggle = ({ layout, onChange }: LayoutToggleProps) => {
  return (
    <SelectButton
      value={layout}
      onChange={(e) => onChange(e.value)}
      optionLabel='label'
      options={options}
      className='flex justify-end m-2 text-xs [&_.p-button]:!px-3 [&_.p-button]:!py-3 [&_.p-highlight]:!bg-primary [&_.p-highlight]:!text-white  '
    />
  )
}

export default LayoutToggle
