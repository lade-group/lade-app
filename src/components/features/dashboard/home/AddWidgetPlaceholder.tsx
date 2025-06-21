import { Add } from '@mui/icons-material'

interface Props {
  onClick: () => void
  isEditing: boolean
}

const AddWidgetPlaceholder = ({ onClick, isEditing }: Props) => (
  <div
    className={`w-full h-full flex items-center justify-center rounded-lg cursor-pointer ${
      isEditing
        ? 'hover:bg-primary/5  border-2 border-dashed border-primary/40'
        : 'pointer-events-none'
    }`}
    onClick={onClick}
  >
    {isEditing ? <Add className='text-primary' /> : null}
  </div>
)

export default AddWidgetPlaceholder
