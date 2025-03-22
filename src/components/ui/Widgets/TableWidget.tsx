import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid'

const rows: GridRowsProp = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
]

const columns: GridColDef[] = [
  { field: 'col1', headerName: 'Column 1', width: 150 },
  { field: 'col2', headerName: 'Column 2', width: 150 },
]

const TableWidget = () => {
  return (
    <div
      className='w-full h-full rounded-lg border text-left shadow-sm bg-white  border-gray-200 z-10'
      data-swapy-item='d'
    >
      <DataGrid rowHeight={38} rows={rows} columns={columns} checkboxSelection />
    </div>
  )
}

export default TableWidget
