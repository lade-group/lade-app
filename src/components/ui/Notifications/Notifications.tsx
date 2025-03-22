import { SyntheticEvent } from 'react'
import { Snackbar, Alert, SnackbarCloseReason } from '@mui/material'

interface NotificationProps {
  notify: {
    isOpen: boolean
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  }
  handleClose: () => void
  position?: 'top' | 'bottom'
}

const Notifications = ({ notify, handleClose, position = 'top' }: NotificationProps) => {
  const handleSnackbarClose = (_?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') return
    handleClose()
  }

  return (
    <Snackbar
      open={notify.isOpen}
      autoHideDuration={2500}
      onClose={handleSnackbarClose}
      anchorOrigin={
        position === 'top'
          ? { vertical: 'top', horizontal: 'right' }
          : { vertical: 'bottom', horizontal: 'right' }
      }
      TransitionProps={{ onExited: handleClose }}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={notify.type}
        variant='filled'
        sx={{ width: '100%' }}
      >
        {notify.message}
      </Alert>
    </Snackbar>
  )
}

export default Notifications
