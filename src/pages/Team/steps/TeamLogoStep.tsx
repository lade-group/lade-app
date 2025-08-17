import { useState } from 'react'
import { TeamFormData } from '../../../types/teams'

interface Props {
  data: TeamFormData
  setData: React.Dispatch<React.SetStateAction<TeamFormData>>
  next: () => void
  back: () => void
}

const TeamLogoStep: React.FC<Props> = ({ data, setData, next, back }) => {
  const [logoFile, setLogoFile] = useState<File | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      console.log('Logo file selected:', file.name, file.size, file.type)
      setLogoFile(file)
      setData({ ...data, logoFile: file })
    }
  }

  return (
    <div className='space-y-6 text-center'>
      <h2 className='text-4xl font-bold'>¿Quieres añadir un logo para tu equipo?</h2>
      <p className='text-sm text-gray-500'>Este paso es opcional.</p>

      <div className='max-w-md mx-auto'>
        <input
          type='file'
          accept='image/*'
          onChange={handleLogoChange}
          className='w-full p-2 border border-gray-300 rounded-md'
        />
        {logoFile && (
          <p className='text-sm text-gray-600 mt-1'>Archivo seleccionado: {logoFile.name}</p>
        )}
      </div>

      <div className='flex justify-between mt-6'>
        <button
          onClick={back}
          className='bg-secondary hover:bg-gray-300 hover:cursor-pointer text-priamry font-medium px-6 py-3 rounded-md transition mt-5'
        >
          Atrás
        </button>
        <button
          onClick={next}
          className='bg-primary hover:bg-primary-hover hover:cursor-pointer text-white font-medium px-6 py-3 rounded-md transition mt-5'
        >
          Siguiente
        </button>
      </div>
    </div>
  )
}

export default TeamLogoStep
