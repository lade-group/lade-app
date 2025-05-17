import { useRef, useState } from 'react'

import { TeamFormData } from '../../../types/teams'

interface Props {
  data: TeamFormData
  setData: React.Dispatch<React.SetStateAction<TeamFormData>>
  next: () => void
  back: () => void
}

const TeamLogoStep: React.FC<Props> = ({ data, setData, next, back }) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(data.logo || null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
        setData({ ...data, logo: reader.result as string }) // puede ser base64 o usar file.name si prefieres backend
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
        setData({ ...data, logo: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className='space-y-6 text-center'>
      <h2 className='text-4xl font-bold'>¿Quieres añadir un logo para tu equipo?</h2>
      <p className='text-sm text-gray-500'>Este paso es opcional.</p>

      <div
        className='w-full border-2 border-dashed border-gray-300 rounded-md p-6 text-center cursor-pointer hover:border-primary transition'
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {previewUrl ? (
          <div className='flex flex-col items-center gap-4'>
            <img
              src={previewUrl}
              alt='Logo preview'
              className='w-32 h-32 object-cover rounded shadow'
            />
            <button
              className='text-primary text-sm underline'
              onClick={(e) => {
                e.stopPropagation()
                setPreviewUrl(null)
                setData({ ...data, logo: '' })
              }}
            >
              Cambiar imagen
            </button>
          </div>
        ) : (
          <p className='text-gray-500'>
            Haz clic o arrastra una imagen aquí para subir el logo del equipo
          </p>
        )}
        <input type='file' accept='image/*' ref={fileInputRef} onChange={handleFileSelect} hidden />
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
