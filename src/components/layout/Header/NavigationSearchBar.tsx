import { useState, useEffect } from 'react'
import { Autocomplete, TextField, InputAdornment } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import { useNavigate } from 'react-router'
import { ROUTES } from '../../../constants/routes'

const NavigationSearchBar = () => {
  const navigate = useNavigate()
  const [options, setOptions] = useState<any>([])

  useEffect(() => {
    const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()

    const transformObjectToArray = (obj: Record<string, string>) =>
      Object.entries(obj).map(([key, value]) => ({ label: capitalize(key), path: value }))

    setOptions([...transformObjectToArray(ROUTES)])
  }, [])

  const handleNavigate = (_: any, value: any) => {
    if (value) {
      navigate(value.path)
    }
  }

  return (
    <Autocomplete
      options={options}
      getOptionLabel={(option) => option.label}
      onChange={handleNavigate}
      renderInput={(params) => (
        <TextField
          {...params}
          variant='outlined'
          placeholder='Buscar...'
          size='small'
          className='w-full max-w-sm rounded-full'
          slotProps={{
            input: {
              ...params.InputProps,
              startAdornment: (
                <InputAdornment position='start'>
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      )}
    />
  )
}

export default NavigationSearchBar
