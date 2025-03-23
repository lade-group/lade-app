import { useState } from 'react'
import { IconButton, TextField, Divider, Button } from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import Save from '@mui/icons-material/Save'
import DummyAvatar from '../../../assets/images/Madara.jpg'

const Profile = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false)

  const handleEditing = () => {
    setIsEditing((prev) => !prev)
  }

  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='text-4xl text-primary font-bold'>Ajustes de Perfil</h1>
        <IconButton onClick={handleEditing}>
          {isEditing ? <Save className='text-primary' /> : <EditIcon className='text-primary' />}
        </IconButton>
      </div>
      <div>
        <span className='text-lg'>Maneja tus datos de la mejor forma</span>
      </div>
      {!isEditing && (
        <div className='w-full pt-10 flex'>
          <div className='flex flex-row  w-full gap-10 '>
            <div>
              <img src={DummyAvatar} alt='Avatar' className='w-80 rounded-2xl' />
            </div>
            <div className='flex flex-col w-full pt-6'>
              <div className='flex flex-col'>
                <span className='text-3xl text-primary font-bold'>
                  Diego Antonio Lopez Martinez
                </span>
                <span className='text-2xl text-primary font-extralight'>
                  Generente de Logistica
                </span>
              </div>
              <div className='flex flex-col pt-5'>
                <span className='text-md text-primary'>Nombre preferido: Diego</span>
                <span className='text-md text-primary'>Correo: diego456.dlm77@gmail.com</span>
                <span className='text-md text-primary'>Telefono: +5298441039924</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {isEditing && (
        <div className='w-full pb-50 pt-10 flex'>
          <div className='flex flex-row  w-full gap-10 '>
            <div className='flex flex-col gap-5'>
              <img src={DummyAvatar} alt='Avatar' className='w-80 rounded-2xl' />
              <Button variant='contained' color='primary'>
                Actualizar Imagen
              </Button>
              <Button variant='outlined' color='primary'>
                Borrar Imagen
              </Button>
            </div>
            <div className='w-full pt-6'>
              <div className='flex flex-col'>
                <Divider textAlign='left' className='pb-5'>
                  <span className='text-lg text-primary'>Informacion personal</span>
                </Divider>
                <div className='grid grid-cols-7 gap-5'>
                  <TextField label='Nombre(s)' variant='outlined' className='col-span-3' />
                  <TextField label='Apellido Paterno' variant='outlined' className='col-span-2' />
                  <TextField label='Apeillido Materno' variant='outlined' className='col-span-2' />
                </div>
                <div className='pt-5 grid grid-cols-2 gap-5'>
                  <TextField label='Puesto' variant='outlined' />
                  <TextField label='Nombre Preferido' variant='outlined' />
                </div>
                <div className='pt-5 flex flex-col'>
                  <Button variant='contained' color='primary'>
                    Actualizar Informacion
                  </Button>
                </div>
                <Divider textAlign='left' className='pt-10 pb-5'>
                  <span className='text-lg text-primary'>Informacion de Contacto</span>
                </Divider>
                <div className='grid grid-cols-12 gap-5'>
                  <TextField label='Email' variant='outlined' className='col-span-9' />
                  <Button variant='contained' color='primary' className='col-span-3'>
                    Actualizar Correo
                  </Button>
                </div>
                <div className='grid grid-cols-12 gap-5 pt-5'>
                  <TextField label='Telefono' variant='outlined' className='col-span-9' />
                  <Button variant='contained' color='primary' className='col-span-3'>
                    Actualizar Telefono
                  </Button>
                </div>
                <Divider textAlign='left' className='pt-10 pb-5'>
                  <span className='text-lg text-primary'>Seguridad de cuenta</span>
                </Divider>
                <div className='flex flex-col gap-5 pt-5'>
                  <TextField label='Contraseña Antigua' variant='outlined' />
                  <TextField label='Contraseña Nueva' variant='outlined' />
                  <Button variant='contained' color='primary'>
                    Actualizar Contraseña
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Profile
