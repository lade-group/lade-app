import { useState, SyntheticEvent } from 'react'
import { Link } from 'react-router'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const ClientPage = () => {
  const [value, setValue] = useState(0)

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
      </div>
    </div>
  )
}

export default ClientPage
