export interface S3UploadConfig {
  folder: 'teams' | 'drivers-profile' | 'drivers-files' | 'clients-files' | 'user-profiles'
  allowedTypes: string[]
  maxSizeMB: number
  showPreview?: boolean
  multiple?: boolean
}

export interface S3UploadResponse {
  success: boolean
  url?: string
  key?: string
  error?: string
}

class S3Service {
  private baseUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/dms`

  /**
   * Genera una URL de subida para un archivo
   */
  async generateUploadUrl(
    fileName: string,
    contentType: string,
    folder: string,
    entityId?: string
  ): Promise<{ uploadUrl: string; key: string }> {
    const response = await fetch(`${this.baseUrl}/s3/upload-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({
        fileName,
        contentType,
        folder,
        entityId,
      }),
    })

    if (!response.ok) {
      throw new Error('Error al generar URL de subida')
    }

    return response.json()
  }

  /**
   * Sube un archivo directamente a S3
   */
  async uploadFile(file: File, folder: string, entityId?: string): Promise<S3UploadResponse> {
    try {
      // Generar URL de subida
      const { uploadUrl, key } = await this.generateUploadUrl(
        file.name,
        file.type,
        folder,
        entityId
      )

      // Subir archivo directamente a S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Error al subir archivo a S3')
      }

      // Generar URL de descarga
      const downloadUrl = await this.generateDownloadUrl(key)

      return {
        success: true,
        url: downloadUrl,
        key,
      }
    } catch (error) {
      console.error('Error en uploadFile:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }
    }
  }

  /**
   * Genera una URL de descarga para un archivo
   */
  async generateDownloadUrl(key: string): Promise<string> {
    const response = await fetch(`${this.baseUrl}/s3/download-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
      },
      body: JSON.stringify({ key }),
    })

    if (!response.ok) {
      throw new Error('Error al generar URL de descarga')
    }

    const { downloadUrl } = await response.json()
    return downloadUrl
  }

  /**
   * Elimina un archivo de S3
   */
  async deleteFile(key: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/s3/delete`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ key }),
      })

      return response.ok
    } catch (error) {
      console.error('Error al eliminar archivo:', error)
      return false
    }
  }

  /**
   * Valida un archivo según la configuración
   */
  validateFile(file: File, config: S3UploadConfig): { valid: boolean; error?: string } {
    // Validar tipo de archivo
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    if (!config.allowedTypes.includes(fileExtension || '')) {
      return {
        valid: false,
        error: `Tipo de archivo no permitido. Tipos permitidos: ${config.allowedTypes.join(', ')}`,
      }
    }

    // Validar tamaño
    const maxSizeBytes = config.maxSizeMB * 1024 * 1024
    if (file.size > maxSizeBytes) {
      return {
        valid: false,
        error: `El archivo es demasiado grande. Tamaño máximo: ${config.maxSizeMB}MB`,
      }
    }

    return { valid: true }
  }

  /**
   * Genera una vista previa de imagen
   */
  generateImagePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}

export const s3Service = new S3Service()
