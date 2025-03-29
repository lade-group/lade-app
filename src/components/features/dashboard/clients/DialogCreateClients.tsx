import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button, Select, MenuItem, InputLabel, SelectChangeEvent, FormControl } from '@mui/material'
import HandshakeIcon from '@mui/icons-material/Handshake'
import TextField from '@mui/material/TextField'

const DialogCreateClients = () => {
  const [visible, setVisible] = useState(false)
  const footerContent = (
    <div className='flex gap-5 justify-end'>
      <Button variant='outlined' color='primary' onClick={() => setVisible(false)}>
        Cancelar
      </Button>
      <Button variant='contained' color='primary' onClick={() => setVisible(false)}>
        Guardar
      </Button>
    </div>
  )

  const headerContent = (
    <div className='flex gap-5'>
      <span>Crear Cliente Nuevo</span>
      <HandshakeIcon />
    </div>
  )

  const [clientType, setClientType] = useState('')

  const handleChange = (event: SelectChangeEvent) => {
    setClientType(event.target.value)
  }

  return (
    <div className='card flex justify-content-center '>
      <Button
        variant='contained'
        color='primary'
        onClick={() => setVisible(true)}
        id='create-client-button'
      >
        Agregar Cliente
      </Button>
      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: '50vw' }}
        onHide={() => {
          if (!visible) return
          setVisible(false)
        }}
        footer={footerContent}
      >
        <div className='grid grid-cols-6 grid-rows-4 gap-5 mt-2'>
          <TextField
            id=''
            label='Nombre Fiscal'
            variant='outlined'
            required
            className='col-span-2'
          />
          <TextField
            id=''
            label='Apodo o Nombre de Referencia'
            variant='outlined'
            className='col-span-2'
          />

          <FormControl className='col-span-2'>
            <InputLabel id='select-type-client-label'>Tipo de Cliente</InputLabel>
            <Select
              required
              labelId='select-type-client-label'
              id='select-type-client'
              value={clientType}
              label='Tipo de Cliente'
              onChange={handleChange}
            >
              <MenuItem value={0}>Nacional</MenuItem>
              <MenuItem value={1}>Internacional</MenuItem>
            </Select>
          </FormControl>

          <TextField id='' label='RFC' variant='outlined' required className='col-span-3' />
          <TextField id='' label='CURP' variant='outlined' className='col-span-3' />

          <TextField
            id=''
            label='Descripcion Breve de la Empresa'
            multiline
            rows={4}
            variant='outlined'
            className='col-span-6 row-span-2'
          />
        </div>
      </Dialog>
    </div>
  )
}

export default DialogCreateClients
