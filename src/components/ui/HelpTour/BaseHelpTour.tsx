import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import { IconButton } from '@mui/material'
import { driver } from 'driver.js'
import 'driver.js/dist/driver.css'

const BaseHelpTour = ({ steps }: { steps: any }) => {
  const driverObj = driver({
    showProgress: true,
    showButtons: ['next', 'previous'],
    steps: steps,
  })

  const handleStartTour = () => {
    driverObj.drive()
  }

  return (
    <IconButton onClick={handleStartTour}>
      <HelpOutlineIcon color='primary' />
    </IconButton>
  )
}

export default BaseHelpTour
