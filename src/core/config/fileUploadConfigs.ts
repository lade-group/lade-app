import { S3UploadConfig } from '../services/s3Service'

// Configuración para logos de equipos
export const teamLogoConfig: S3UploadConfig = {
  folder: 'teams',
  allowedTypes: ['jpg', 'jpeg', 'png', 'gif', 'svg'],
  maxSizeMB: 5,
  showPreview: true,
  multiple: false,
}

// Configuración para fotos de perfil de conductores
export const driverProfileConfig: S3UploadConfig = {
  folder: 'drivers-profile',
  allowedTypes: ['jpg', 'jpeg', 'png', 'gif'],
  maxSizeMB: 3,
  showPreview: true,
  multiple: false,
}

// Configuración para documentos de conductores (licencias, etc.)
export const driverFilesConfig: S3UploadConfig = {
  folder: 'drivers-files',
  allowedTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'],
  maxSizeMB: 10,
  showPreview: false,
  multiple: true,
}

// Configuración para documentos de clientes
export const clientFilesConfig: S3UploadConfig = {
  folder: 'clients-files',
  allowedTypes: ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx', 'xls', 'xlsx'],
  maxSizeMB: 15,
  showPreview: false,
  multiple: true,
}

// Configuración para fotos de perfil de usuarios
export const userProfileConfig: S3UploadConfig = {
  folder: 'drivers-profile', // Usamos la misma carpeta que conductores
  allowedTypes: ['jpg', 'jpeg', 'png', 'gif'],
  maxSizeMB: 2,
  showPreview: true,
  multiple: false,
}

// Configuración para documentos generales
export const generalFilesConfig: S3UploadConfig = {
  folder: 'clients-files', // Usamos la carpeta de clientes como general
  allowedTypes: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt'],
  maxSizeMB: 20,
  showPreview: false,
  multiple: true,
}

// Configuración para fotos de perfil de vehículos
export const vehicleProfileConfig: S3UploadConfig = {
  folder: 'vehicles-profile',
  allowedTypes: ['jpg', 'jpeg', 'png', 'webp'],
  maxSizeMB: 5,
  showPreview: true,
  multiple: false,
}

// Configuración para documentos de vehículos (seguros, registros, etc.)
export const vehicleFilesConfig: S3UploadConfig = {
  folder: 'vehicles-files',
  allowedTypes: ['pdf', 'doc', 'docx', 'jpg', 'jpeg', 'png'],
  maxSizeMB: 10,
  showPreview: false,
  multiple: true,
}
