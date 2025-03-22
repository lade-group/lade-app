import { IconButton, Button, Collapse, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import SaveIcon from '@mui/icons-material/Save'

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
          <Button variant='outlined' startIcon={<SaveIcon />}>
            Guardar
          </Button>
        </div>
      </Collapse>
    </Box>
  )
}

export default AnimatedButtonGroup
