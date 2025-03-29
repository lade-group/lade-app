import { useState, SyntheticEvent } from 'react'
import { Link } from 'react-router'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  TextField,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  FormControl,
} from '@mui/material'

import StateCitySelect from '../../../components/ui/SelectFields/StateCitySelect'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const ClientPage = () => {
  const [value, setValue] = useState(0)

  const [clientType, setClientType] = useState('')

  const handleChangeClient = (event: SelectChangeEvent) => {
    setClientType(event.target.value)
  }
  const handleChange = (_: SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <div>
      <div className='flex flex-row gap-5'>
        <Link to='/dashboard/clients' className='flex justify-center items-center'>
          <ArrowBackIcon />
        </Link>
        <h1 className='text-4xl text-primary font-bold'>Cliente 1</h1>
      </div>

      <div className='w-full pt-5'>
        <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
          <Tab label='Informacion Principal' {...a11yProps(4)} />
          <Tab label='Direccion Fiscal' {...a11yProps(0)} />
          <Tab label='Informacion Financiera' {...a11yProps(1)} />
          <Tab label='Informacion de Facturacion' {...a11yProps(2)} />
          <Tab label='Archivos/Contenido Extra' {...a11yProps(3)} />
        </Tabs>
        <div className='w-full pt-5 px-5 text-2xl font-semibold text-primary'>
          {value === 0 && (
            <div
              id='simple-tabpanel-0'
              role='tabpanel'
              aria-labelledby='simple-tab-0'
              hidden={value !== 0}
            >
              <h1 className='pb-5'>Informacion Principal</h1>
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
                    onChange={handleChangeClient}
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
            </div>
          )}
          {value === 1 && (
            <div
              id='simple-tabpanel-1'
              role='tabpanel'
              aria-labelledby='simple-tab-1'
              hidden={value !== 1}
            >
              <h1>Direccion Fiscal</h1>
              <div className='grid grid-cols-6 grid-rows-5 gap-5 mt-2'>
                <TextField id='' label='Calle' variant='outlined' required className='col-span-2' />
                <TextField
                  id=''
                  label='Numero Exterior'
                  variant='outlined'
                  className='col-span-2'
                />
                <TextField
                  id=''
                  label='Numero Interior'
                  variant='outlined'
                  className='col-span-2'
                />
                <TextField
                  id=''
                  label='Colonia'
                  variant='outlined'
                  required
                  className='col-span-2'
                />
                <TextField
                  id=''
                  label='Codigo Postal'
                  variant='outlined'
                  required
                  className='col-span-2'
                />
                <TextField
                  id=''
                  label='Ciudad'
                  variant='outlined'
                  required
                  className='col-span-2'
                />
                <StateCitySelect />
                <TextField id='' label='Pais' variant='outlined' required className='col-span-2' />
                <TextField
                  id=''
                  label='Referencia'
                  multiline
                  rows={3}
                  variant='outlined'
                  className='col-span-6 row-span-2'
                />
              </div>
              <h1>Informacion de Contacto</h1>
              <div className='grid grid-cols-4 grid-rows-4 gap-5 mt-2'>
                <TextField
                  id=''
                  label='Telefono'
                  variant='outlined'
                  required
                  className='col-span-2'
                />
                <TextField
                  id=''
                  label='Telefono Secundario'
                  variant='outlined'
                  className='col-span-2'
                />
                <TextField
                  id=''
                  label='Correo Electronico'
                  variant='outlined'
                  required
                  className='col-span-2'
                />
                <TextField
                  id=''
                  label='Correo Electronico Secundario'
                  variant='outlined'
                  className='col-span-2'
                />
                <TextField id='' label='Pagina Web' variant='outlined' className='col-span-2' />
              </div>
            </div>
          )}
          {value === 2 && (
            <div
              id='simple-tabpanel-2'
              role='tabpanel'
              aria-labelledby='simple-tab-2'
              hidden={value !== 2}
            >
              <h1>Informacion Financiera</h1>
            </div>
          )}
          {value === 3 && (
            <div
              id='simple-tabpanel-3'
              role='tabpanel'
              aria-labelledby='simple-tab-3'
              hidden={value !== 3}
            >
              <h1>Informacion de Facturacion</h1>
            </div>
          )}
          {value === 4 && (
            <div
              id='simple-tabpanel-4'
              role='tabpanel'
              aria-labelledby='simple-tab-4'
              hidden={value !== 4}
            >
              <h1>Archivos/Contenido Extra</h1>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ClientPage
