import { useState } from 'react'
import { TextField } from '@mui/material'
import { useNotification } from '../../../core/contexts/NotificationContext'
import { TeamFormData } from '../../../types/teams'

interface Props {
  data: TeamFormData
  setData: React.Dispatch<React.SetStateAction<TeamFormData>>
  next: () => void
  back: () => void
}

const TeamInviteStep: React.FC<Props> = ({ data, setData, next, back }) => {
  const [emails, setEmails] = useState(data.invites?.join(', ') || '')
  const { showNotification } = useNotification()

  const handleContinue = () => {
    const parsedEmails = emails
      .split(',')
      .map((e) => e.trim())
      .filter((e) => e.length > 0)

    const validateEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    const invalidEmails = parsedEmails.filter((email) => !validateEmail(email))

    if (invalidEmails.length > 0) {
      showNotification(
        `Los siguientes correos no son válidos: ${invalidEmails.join(', ')}`,
        'warning'
      )
      return
    }

    setData({ ...data, invites: parsedEmails })
    next()
  }

  return (
    <div className='space-y-6 text-center'>
      <h2 className='text-4xl font-bold'>¿Quién más está en tu equipo?</h2>
      <p className='text-sm text-gray-500'>
        Agrega correos separados por coma. Este paso es opcional.
      </p>

      <TextField
        label='Correos electrónicos'
        variant='outlined'
        multiline
        rows={3}
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        placeholder='ejemplo@correo.com, otro@dominio.com'
        fullWidth
      />

      <div className='flex justify-between mt-6'>
        <button
          onClick={back}
          className='bg-secondary hover:bg-gray-300 hover:cursor-pointer text-priamry font-medium px-6 py-3 rounded-md transition mt-5'
        >
          Atrás
        </button>
        <button
          onClick={handleContinue}
          className='bg-primary hover:bg-primary-hover hover:cursor-pointer text-white font-medium px-6 py-3 rounded-md transition mt-5'
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default TeamInviteStep
