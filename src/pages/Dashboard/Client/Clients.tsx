import { useState } from 'react'
import { DataTable, DataTableSelectEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import Button from '@mui/material/Button'

interface Client {
  code?: string
  company?: string
  name_related?: string
  email?: string
  phone?: string
  status?: string
  last_service_date?: string
}

const Clients = () => {
  const [clients, setClients] = useState<Client[]>([
    {
      code: '123',
      company: 'GM',
      name_related: 'GM planta Saltillo',
      email: 'eduardo.varela@gm.com',
      phone: '+528441039924',
      status: 'Activo',
      last_service_date: '',
    },
    {
      code: '124',
      company: 'Stelantins',
      name_related: 'Stelantins planta Derramadero',
      email: 'eduardo.varela@stelantis.com',
      phone: '+528441039924',
      status: 'Desactivado',
      last_service_date: '',
    },
    {
      code: '125',
      company: 'ZF',
      name_related: 'ZF planta Ramos',
      email: 'eduardo.varela@zf.com',
      phone: '+528441039924',
      status: 'Activo',
      last_service_date: '',
    },
    {
      code: '126',
      company: 'Daimler',
      name_related: 'Daimler planta Derramadero',
      email: 'eduardo.varela@daimler.com',
      phone: '+528441039924',
      status: 'Eliminado',
      last_service_date: '',
    },
  ])

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const rowSelected = (e: DataTableSelectEvent) => {
    console.log(e.data)
  }

  const statusBodyTemplate = (client: Client) => {
    return <Tag value={client.status} severity={getSeverity(client)}></Tag>
  }

  const getSeverity = (client: Client) => {
    switch (client.status) {
      case 'Activo':
        return 'success'

      case 'Desactivado':
        return 'warning'

      case 'Eliminado':
        return 'danger'

      default:
        return null
    }
  }

  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='text-4xl text-primary font-bold'>Clientes</h1>
        <Button variant='contained' color='primary'>
          Agregar Cliente
        </Button>
      </div>
      <div>
        <span className='text-lg'>Agrega y Visualiza la informacion de tus clientes</span>
      </div>
      <div className='w-full pt-10'>
        <DataTable
          removableSort
          value={clients}
          sortMode='multiple'
          tableStyle={{ minWidth: '50rem' }}
          selection={selectedClient}
          onSelectionChange={(e) => setSelectedClient(e.value)}
          selectionMode='single'
          onRowSelect={rowSelected}
          paginator
          rows={25}
          rowsPerPageOptions={[25, 50, 75, 100]}
          scrollable
          scrollHeight='flex'
        >
          <Column field='code' header='ID' sortable></Column>
          <Column field='name_related' header='Nombre asignado' sortable></Column>
          <Column field='company' header='Empresa' sortable></Column>
          <Column field='email' header='Email' sortable></Column>
          <Column field='phone' header='Telefono' sortable></Column>
          <Column field='status' header='Estatus' body={statusBodyTemplate} sortable></Column>
          <Column
            field='last_service_date'
            header='Fecha de ultimo servicio realizado'
            sortable
          ></Column>
        </DataTable>
      </div>
    </div>
  )
}

export default Clients
