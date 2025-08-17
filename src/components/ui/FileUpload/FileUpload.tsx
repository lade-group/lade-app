import React, { useRef, useState, useCallback } from 'react'
import { Button } from 'primereact/button'
import { ProgressBar } from 'primereact/progressbar'
import { Toast } from 'primereact/toast'
import { useNotification } from '../../../core/contexts/NotificationContext'

export interface S3UploadConfig {
  folder: string
  allowedTypes: string[]
  maxSizeMB: number
  multiple?: boolean
  showPreview?: boolean
}

export interface S3UploadResponse {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export interface FileUploadProps {
  config: S3UploadConfig
  entityId?: string
  onUploadSuccess: (response: S3UploadResponse) => void
  onUploadError?: (error: string) => void
  currentFileUrl?: string
  placeholder?: string
  className?: string
  disabled?: boolean
}

interface UploadedFile {
  file: File
  preview?: string
  progress: number
  status: 'uploading' | 'success' | 'error'
  response?: S3UploadResponse
}

const FileUpload: React.FC<FileUploadProps> = ({
  config,
  entityId,
  onUploadSuccess,
  onUploadError,
  currentFileUrl,
  placeholder = 'Haz clic o arrastra archivos aquí',
  className = '',
  disabled = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useRef<Toast>(null)
  const { showNotification } = useNotification()

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [currentPreview, setCurrentPreview] = useState<string | null>(currentFileUrl || null)

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return

      const fileArray = Array.from(files)
      const newUploads: UploadedFile[] = []

      for (const file of fileArray) {
        // Validar archivo
        const maxSizeBytes = config.maxSizeMB * 1024 * 1024
        if (file.size > maxSizeBytes) {
          showNotification(`El archivo es demasiado grande. Máximo: ${config.maxSizeMB}MB`, 'error')
          continue
        }

        const fileExtension = file.name.split('.').pop()?.toLowerCase()
        if (!fileExtension || !config.allowedTypes.includes(fileExtension)) {
          showNotification(
            `Tipo de archivo no permitido. Permitidos: ${config.allowedTypes.join(', ')}`,
            'error'
          )
          continue
        }

        // Generar preview si es imagen y se requiere
        let preview: string | undefined
        if (config.showPreview && file.type.startsWith('image/')) {
          try {
            preview = URL.createObjectURL(file)
          } catch (error) {
            console.error('Error generando preview:', error)
          }
        }

        const uploadFile: UploadedFile = {
          file,
          preview,
          progress: 0,
          status: 'uploading',
        }

        newUploads.push(uploadFile)
        setUploadedFiles((prev) => [...prev, uploadFile])

        // Subir archivo al backend
        try {
          const formData = new FormData()
          formData.append('file', file)
          formData.append('folder', config.folder)
          if (entityId) {
            formData.append('entityId', entityId)
          }

          const response = await fetch('http://localhost:3000/dms/upload', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
            },
            body: formData,
          })

          if (response.ok) {
            const result = await response.json()
            const uploadResponse: S3UploadResponse = {
              success: true,
              url: result.url,
              key: result.key,
            }

            setUploadedFiles((prev) =>
              prev.map((upload) =>
                upload.file === file
                  ? { ...upload, status: 'success', progress: 100, response: uploadResponse }
                  : upload
              )
            )

            onUploadSuccess(uploadResponse)

            // Si es una imagen y se requiere preview, actualizar
            if (config.showPreview && file.type.startsWith('image/') && uploadResponse.url) {
              setCurrentPreview(uploadResponse.url)
            }

            showNotification('Archivo subido exitosamente', 'success')
          } else {
            const errorData = await response.json()
            setUploadedFiles((prev) =>
              prev.map((upload) =>
                upload.file === file ? { ...upload, status: 'error', progress: 0 } : upload
              )
            )

            const errorMsg = errorData.message || 'Error al subir archivo'
            showNotification(errorMsg, 'error')
            onUploadError?.(errorMsg)
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Error desconocido'
          setUploadedFiles((prev) =>
            prev.map((upload) =>
              upload.file === file ? { ...upload, status: 'error', progress: 0 } : upload
            )
          )

          showNotification(errorMsg, 'error')
          onUploadError?.(errorMsg)
        }
      }
    },
    [config, entityId, onUploadSuccess, onUploadError, showNotification]
  )

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(event.target.files)
    // Limpiar input para permitir subir el mismo archivo
    if (event.target) {
      event.target.value = ''
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      handleFileSelect(e.dataTransfer.files)
    },
    [handleFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleRemoveFile = (uploadedFile: UploadedFile) => {
    setUploadedFiles((prev) => prev.filter((upload) => upload.file !== uploadedFile.file))

    // Si era el archivo actual, limpiar preview
    if (uploadedFile.response?.url === currentPreview) {
      setCurrentPreview(null)
    }

    // Eliminar de S3 si se subió exitosamente
    if (uploadedFile.response?.key) {
      fetch(`http://localhost:3000/dms/${uploadedFile.response.key}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
      }).catch((error: any) => {
        console.error('Error eliminando archivo de S3:', error)
      })
    }
  }

  const handleRemoveCurrent = () => {
    setCurrentPreview(null)
    onUploadSuccess({ success: true, url: '', key: '' })
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf'
      case 'doc':
      case 'docx':
        return 'pi pi-file-word'
      case 'xls':
      case 'xlsx':
        return 'pi pi-file-excel'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'svg':
        return 'pi pi-image'
      default:
        return 'pi pi-file'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`file-upload ${className}`}>
      <Toast ref={toast} />

      {/* Área de subida */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
          ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {config.showPreview && currentPreview ? (
          <div className='flex flex-col items-center gap-4'>
            <img
              src={currentPreview}
              alt='Preview'
              className='w-32 h-32 object-cover rounded-lg shadow-md'
            />
            <div className='flex gap-2'>
              <Button
                icon='pi pi-pencil'
                label='Cambiar'
                className='p-button-sm p-button-outlined'
                onClick={(e) => {
                  e.stopPropagation()
                  fileInputRef.current?.click()
                }}
              />
              <Button
                icon='pi pi-trash'
                label='Eliminar'
                className='p-button-sm p-button-danger p-button-outlined'
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemoveCurrent()
                }}
              />
            </div>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-4'>
            <i className='pi pi-cloud-upload text-4xl text-gray-400'></i>
            <div>
              <p className='text-gray-600 font-medium'>{placeholder}</p>
              <p className='text-sm text-gray-500 mt-1'>
                Tipos permitidos: {config.allowedTypes.join(', ')} | Máximo: {config.maxSizeMB}MB
              </p>
            </div>
          </div>
        )}

        <input
          ref={fileInputRef}
          type='file'
          accept={config.allowedTypes.map((type) => `.${type}`).join(',')}
          multiple={config.multiple}
          onChange={handleInputChange}
          className='hidden'
          disabled={disabled}
        />
      </div>

      {/* Lista de archivos subidos */}
      {uploadedFiles.length > 0 && (
        <div className='mt-4 space-y-2'>
          <h4 className='font-medium text-gray-700'>Archivos subidos:</h4>
          {uploadedFiles.map((upload, index) => (
            <div
              key={index}
              className='flex items-center justify-between p-3 bg-gray-50 rounded-lg'
            >
              <div className='flex items-center gap-3'>
                <i className={`${getFileIcon(upload.file.name)} text-xl`}></i>
                <div>
                  <p className='font-medium text-sm'>{upload.file.name}</p>
                  <p className='text-xs text-gray-500'>{formatFileSize(upload.file.size)}</p>
                </div>
              </div>

              <div className='flex items-center gap-2'>
                {upload.status === 'uploading' && (
                  <div className='w-24'>
                    <ProgressBar value={upload.progress} showValue={false} />
                  </div>
                )}

                {upload.status === 'success' && <i className='pi pi-check text-green-500'></i>}

                {upload.status === 'error' && <i className='pi pi-times text-red-500'></i>}

                <Button
                  icon='pi pi-trash'
                  className='p-button-sm p-button-danger p-button-outlined'
                  onClick={() => handleRemoveFile(upload)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default FileUpload
