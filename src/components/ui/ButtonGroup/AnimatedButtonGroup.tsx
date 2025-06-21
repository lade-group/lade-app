import { IconButton, Collapse, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface AnimatedButtonGroupProps {
  isEditing: boolean
  onToggleEditing: () => void
}

const AnimatedButtonGroup = ({ isEditing, onToggleEditing }: AnimatedButtonGroupProps) => {
  return (
    <Box display='flex' alignItems='center' gap={2}>
      <Collapse
        orientation='horizontal'
        in={isEditing}
        collapsedSize={0}
        style={{ transformOrigin: 'right center' }}
      >
        <div className='flex gap-2'>
          <IconButton onClick={onToggleEditing}>
            <CloseIcon />
          </IconButton>
          <button className='bg-primary hover:bg-primary-hover text-white  font-medium px-6 py-3 w-full rounded-md  cursor-pointer'>
            Guardar
          </button>
        </div>
      </Collapse>
    </Box>
  )
}

export default AnimatedButtonGroup
