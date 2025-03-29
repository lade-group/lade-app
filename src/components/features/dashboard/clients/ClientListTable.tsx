import { useEffect, useState } from 'react'
import { Paginator, PaginatorPageChangeEvent } from 'primereact/paginator'
import { DataTable, DataTableSelectEvent } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Tag } from 'primereact/tag'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../../../constants/routes'

interface Client {
  code?: string
  company?: string
  name_related?: string
  email?: string
  phone?: string
  status?: string
  last_service_date?: string
}

const ClientListTable = () => {
  const navigate = useNavigate()
  const [clients, setClients] = useState<Client[]>([])

  useEffect(() => {
    setClients([
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
  }, [])

  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

  const rowSelected = (e: DataTableSelectEvent) => {
    navigate(`${ROUTES.CLIENTES}/${e.data.code}`)
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

  const [first, setFirst] = useState(0)
  const [rows, setRows] = useState(10)

  const onPageChange = (event: PaginatorPageChangeEvent) => {
    setFirst(event.first)
    setRows(event.rows)
  }

  return (
    <div className='flex flex-col justify-between content-between '>
      <DataTable
        lazy
        removableSort
        value={clients}
        sortMode='multiple'
        tableStyle={{ minWidth: '50rem' }}
        selection={selectedClient}
        onSelectionChange={(e) => setSelectedClient(e.value)}
        selectionMode='single'
        onRowSelect={rowSelected}
        scrollable
        scrollHeight='flex'
      >
        <Column field='code' header='ID' sortable></Column>
        <Column field='name_related' header='Nombre asignado' sortable></Column>
        <Column field='company' header='Empresa' sortable></Column>
        <Column field='email' header='Email' sortable></Column>
        <Column field='phone' header='Telefono' sortable></Column>
        <Column field='status' header='Estatus' body={statusBodyTemplate} sortable></Column>
        <Column field='last_service_date' header='Servicio Realizado' sortable></Column>
      </DataTable>
      <Paginator
        first={first}
        rows={rows}
        totalRecords={120}
        rowsPerPageOptions={[15, 20, 30]}
        onPageChange={onPageChange}
      />
    </div>
  )
}

export default ClientListTable
