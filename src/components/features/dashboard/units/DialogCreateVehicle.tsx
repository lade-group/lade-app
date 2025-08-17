import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { useVehicleStore } from '../../../../core/store/VehicleStore'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'

const DialogCreateVehicle = () => {
  const [visible, setVisible] = useState(false)
  const [plate, setPlate] = useState('')
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [type, setType] = useState('')
  const [year, setYear] = useState('')
  const [status, setStatus] = useState<
    'DISPONIBLE' | 'EN_USO' | 'MANTENIMIENTO' | 'CANCELADO' | 'DESUSO'
  >('DISPONIBLE')
  const [photoFile, setPhotoFile] = useState<File | null>(null)

  // Campos adicionales
  const [capacity, setCapacity] = useState('')
  const [fuelType, setFuelType] = useState('')
  const [insuranceNumber, setInsuranceNumber] = useState('')
  const [insuranceExpiry, setInsuranceExpiry] = useState<Date | null>(null)
  const [registrationExpiry, setRegistrationExpiry] = useState<Date | null>(null)
  const [nextMaintenance, setNextMaintenance] = useState<Date | null>(null)
  const [mileage, setMileage] = useState<number | null>(null)
  const [notes, setNotes] = useState('')

  const { createVehicle, typeOptions, statusOptions } = useVehicleStore()
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
    }
  }

  const resetForm = () => {
    setPlate('')
    setBrand('')
    setModel('')
    setType('')
    setYear('')
    setStatus('DISPONIBLE')
    setPhotoFile(null)
    setCapacity('')
    setFuelType('')
    setInsuranceNumber('')
    setInsuranceExpiry(null)
    setRegistrationExpiry(null)
    setNextMaintenance(null)
    setMileage(null)
    setNotes('')
  }

  const validateVehiclePayload = () => {
    if (!plate.trim()) {
      showNotification('La placa es requerida', 'error')
      return false
    }
    if (!brand.trim()) {
      showNotification('La marca es requerida', 'error')
      return false
    }
    if (!model.trim()) {
      showNotification('El modelo es requerido', 'error')
      return false
    }
    if (!type.trim()) {
      showNotification('El tipo es requerido', 'error')
      return false
    }
    if (!year.trim()) {
      showNotification('El año es requerido', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!currentTeam) {
      showNotification('No se encontró el equipo actual', 'error')
      return
    }

    if (!validateVehiclePayload()) return

    const payload = {
      plate: plate.trim(),
      brand: brand.trim(),
      model: model.trim(),
      type: type.trim(),
      year: year.trim(),
      status,
      imageUrl: 'https://via.placeholder.com/300x300?text=Sin+Imagen', // Placeholder por defecto
      capacity: capacity.trim() || undefined,
      fuelType: fuelType.trim() || undefined,
      insuranceNumber: insuranceNumber.trim() || undefined,
      insuranceExpiry: insuranceExpiry?.toISOString() || undefined,
      registrationExpiry: registrationExpiry?.toISOString() || undefined,
      nextMaintenance: nextMaintenance?.toISOString() || undefined,
      mileage: mileage || undefined,
      notes: notes.trim() || undefined,
    }

    const success = await createVehicle(payload, photoFile || undefined)

    if (success) {
      showNotification('Vehículo creado exitosamente', 'success')
      setVisible(false)
      resetForm()
    } else {
      showNotification('Error al crear el vehículo', 'error')
    }
  }

  const headerContent = (
    <div className='flex gap-3 p-4'>
      <span className='text-xl font-medium'>Agregar Vehículo</span>
    </div>
  )

  const footerContent = (
    <div className='flex justify-end gap-4 px-6 pb-4'>
      <Button label='Cancelar' onClick={() => setVisible(false)} className='p-button-secondary' />
      <Button label='Guardar' onClick={handleSubmit} className='p-button-primary' />
    </div>
  )

  return (
    <div>
      <button
        className='bg-primary hover:bg-primary-hover text-white text-center font-medium px-6 py-3 w-full rounded-md transition cursor-pointer'
        onClick={() => setVisible(true)}
      >
        Agregar Vehículo
      </button>

      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: '80vw', maxWidth: '1200px' }}
        onHide={() => setVisible(false)}
        footer={footerContent}
        maximizable
      >
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 p-6'>
          {/* Información Básica */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold border-b pb-2'>Información Básica</h3>

            <div>
              <label className='block text-sm font-medium mb-1'>Placa *</label>
              <InputText
                value={plate}
                onChange={(e) => setPlate(e.target.value)}
                className='w-full'
                placeholder='ABC1234'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Marca *</label>
              <InputText
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className='w-full'
                placeholder='Volvo'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Modelo *</label>
              <InputText
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className='w-full'
                placeholder='FH16'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Tipo *</label>
              <Dropdown
                value={type}
                options={typeOptions.map((opt) => ({ label: opt, value: opt }))}
                onChange={(e) => setType(e.value)}
                className='w-full'
                placeholder='Seleccionar tipo'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Año *</label>
              <InputText
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className='w-full'
                placeholder='2021'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Estatus</label>
              <Dropdown
                value={status}
                options={statusOptions.map((opt) => ({
                  label: opt
                    .replace('_', ' ')
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase()),
                  value: opt,
                }))}
                onChange={(e) => setStatus(e.value)}
                className='w-full'
                placeholder='Seleccionar estatus'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Foto del Vehículo</label>
              <input
                type='file'
                accept='image/*'
                onChange={handlePhotoChange}
                className='w-full p-2 border border-gray-300 rounded-md'
              />
              {photoFile && (
                <p className='text-sm text-gray-600 mt-1'>Archivo seleccionado: {photoFile.name}</p>
              )}
            </div>
          </div>

          {/* Información de Logística */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold border-b pb-2'>Información de Logística</h3>

            <div>
              <label className='block text-sm font-medium mb-1'>Capacidad de Carga</label>
              <InputText
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className='w-full'
                placeholder='20 toneladas'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Tipo de Combustible</label>
              <InputText
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
                className='w-full'
                placeholder='Diesel'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Número de Seguro</label>
              <InputText
                value={insuranceNumber}
                onChange={(e) => setInsuranceNumber(e.target.value)}
                className='w-full'
                placeholder='INS-123456'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Kilometraje</label>
              <InputNumber
                value={mileage}
                onValueChange={(e) => setMileage(e.value || null)}
                className='w-full'
                placeholder='50000'
                mode='decimal'
                minFractionDigits={0}
                maxFractionDigits={0}
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Vencimiento del Seguro</label>
              <Calendar
                value={insuranceExpiry}
                onChange={(e) => setInsuranceExpiry(e.value || null)}
                className='w-full'
                showIcon
                dateFormat='dd/mm/yy'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Vencimiento del Registro</label>
              <Calendar
                value={registrationExpiry}
                onChange={(e) => setRegistrationExpiry(e.value || null)}
                className='w-full'
                showIcon
                dateFormat='dd/mm/yy'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Próximo Mantenimiento</label>
              <Calendar
                value={nextMaintenance}
                onChange={(e) => setNextMaintenance(e.value || null)}
                className='w-full'
                showIcon
                dateFormat='dd/mm/yy'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Notas Adicionales</label>
              <InputTextarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                className='w-full'
                placeholder='Notas adicionales sobre el vehículo...'
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default DialogCreateVehicle
