# Componente FileUpload

Un componente reutilizable para subida de archivos a S3 con diferentes configuraciones según el tipo de archivo.

## Características

- ✅ **Subida directa a S3** usando URLs pre-firmadas
- ✅ **Vista previa de imágenes** para perfiles y logos
- ✅ **Lista de archivos** para documentos múltiples
- ✅ **Drag & Drop** para mejor UX
- ✅ **Validación de tipos** y tamaños de archivo
- ✅ **Barra de progreso** durante la subida
- ✅ **Manejo de errores** con notificaciones
- ✅ **Configuraciones predefinidas** para diferentes usos

## Configuraciones Disponibles

### 1. **teamLogoConfig**

- **Carpeta**: `teams`
- **Tipos**: jpg, jpeg, png, gif, svg
- **Tamaño máximo**: 5MB
- **Vista previa**: ✅
- **Múltiples archivos**: ❌

### 2. **driverProfileConfig**

- **Carpeta**: `drivers-profile`
- **Tipos**: jpg, jpeg, png, gif
- **Tamaño máximo**: 3MB
- **Vista previa**: ✅
- **Múltiples archivos**: ❌

### 3. **driverFilesConfig**

- **Carpeta**: `drivers-files`
- **Tipos**: pdf, jpg, jpeg, png, doc, docx
- **Tamaño máximo**: 10MB
- **Vista previa**: ❌
- **Múltiples archivos**: ✅

### 4. **clientFilesConfig**

- **Carpeta**: `clients-files`
- **Tipos**: pdf, jpg, jpeg, png, doc, docx, xls, xlsx
- **Tamaño máximo**: 15MB
- **Vista previa**: ❌
- **Múltiples archivos**: ✅

## Uso Básico

```tsx
import FileUpload from '../../../components/ui/FileUpload/FileUpload'
import { teamLogoConfig } from '../../../core/config/fileUploadConfigs'
import { S3UploadResponse } from '../../../core/services/s3Service'

const MyComponent = () => {
  const handleUploadSuccess = (response: S3UploadResponse) => {
    if (response.success && response.url) {
      console.log('Archivo subido:', response.url)
    }
  }

  const handleUploadError = (error: string) => {
    console.error('Error:', error)
  }

  return (
    <FileUpload
      config={teamLogoConfig}
      onUploadSuccess={handleUploadSuccess}
      onUploadError={handleUploadError}
      currentFileUrl='https://example.com/current-logo.png'
      placeholder='Subir logo del equipo'
    />
  )
}
```

## Props

| Prop              | Tipo                                   | Requerido | Descripción                                |
| ----------------- | -------------------------------------- | --------- | ------------------------------------------ |
| `config`          | `S3UploadConfig`                       | ✅        | Configuración del tipo de archivo          |
| `onUploadSuccess` | `(response: S3UploadResponse) => void` | ✅        | Callback cuando la subida es exitosa       |
| `onUploadError`   | `(error: string) => void`              | ❌        | Callback cuando hay un error               |
| `currentFileUrl`  | `string`                               | ❌        | URL del archivo actual (para vista previa) |
| `placeholder`     | `string`                               | ❌        | Texto del placeholder                      |
| `className`       | `string`                               | ❌        | Clases CSS adicionales                     |
| `disabled`        | `boolean`                              | ❌        | Deshabilitar el componente                 |
| `entityId`        | `string`                               | ❌        | ID de la entidad (para organizar archivos) |

## Estructura de Carpetas en S3

```
bucket-name/
├── teams/
│   └── team-uuid/
│       └── timestamp-randomstring.png
├── drivers-profile/
│   └── driver-uuid/
│       └── timestamp-randomstring.jpg
├── drivers-files/
│   └── driver-uuid/
│       ├── timestamp-randomstring.pdf
│       └── timestamp-randomstring.jpg
└── clients-files/
    └── client-uuid/
        ├── timestamp-randomstring.pdf
        └── timestamp-randomstring.xlsx
```

## Configuración de S3

Para que funcione, necesitas configurar las siguientes variables de entorno:

```env
# AWS S3 Configuration
S3_ACCESS_KEY=tu_access_key_id
S3_SECRET_ACCESS_KEY=tu_secret_access_key
S3_REGION=us-east-1
S3_BUCKET_NAME=tu_bucket_name
```

## Notas Importantes

1. **Las carpetas se crean automáticamente** en S3 cuando subes el primer archivo
2. **Los archivos se organizan** por entidad (team-uuid, driver-uuid, etc.)
3. **Las URLs de descarga** se generan automáticamente
4. **La validación** se hace tanto en frontend como backend
5. **Los archivos se eliminan** de S3 cuando se eliminan del componente

## Ejemplos de Uso

### Logo de Equipo

```tsx
<FileUpload
  config={teamLogoConfig}
  onUploadSuccess={handleLogoUpload}
  currentFileUrl={team.logo}
  placeholder='Subir logo del equipo'
/>
```

### Foto de Perfil de Conductor

```tsx
<FileUpload
  config={driverProfileConfig}
  entityId={driver.id}
  onUploadSuccess={handlePhotoUpload}
  currentFileUrl={driver.photoUrl}
  placeholder='Subir foto del conductor'
/>
```

### Documentos de Conductor

```tsx
<FileUpload
  config={driverFilesConfig}
  entityId={driver.id}
  onUploadSuccess={handleDocumentUpload}
  placeholder='Subir documentos (licencias, identificaciones, etc.)'
/>
```
