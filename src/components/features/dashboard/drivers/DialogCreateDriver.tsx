import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { useDriverStore } from '../../../../core/store/DriverStore'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'

export type ContactTypeOption = 'EMAIL' | 'PHONE' | 'FAX' | 'OTHER'
export type DriverStatus = 'DISPONIBLE' | 'EN_VIAJE' | 'DESACTIVADO'

const contactTypeOptions: ContactTypeOption[] = ['EMAIL', 'PHONE', 'FAX', 'OTHER']
const driverStatusOptions: DriverStatus[] = ['DISPONIBLE', 'EN_VIAJE', 'DESACTIVADO']

const DialogCreateDriver = () => {
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()
  const [visible, setVisible] = useState(false)
  const [name, setName] = useState('')
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [licenseNumber, setLicenseNumber] = useState('')
  const [status, setStatus] = useState<DriverStatus>('DISPONIBLE')
  const [address, setAddress] = useState({
    street: '',
    exterior_number: '',
    interior_number: '',
    neighborhood: '',
    city: '',
    state: '',
    country: 'México',
    postal_code: '',
  })
  const [contacts, setContacts] = useState<{ type: ContactTypeOption; value: string }[]>([])

  // Campos adicionales
  const [curp, setCurp] = useState('')
  const [rfc, setRfc] = useState('')
  const [birthDate, setBirthDate] = useState<Date | null>(null)
  const [licenseExpiry, setLicenseExpiry] = useState<Date | null>(null)
  const [medicalExpiry, setMedicalExpiry] = useState<Date | null>(null)
  const [emergencyContact, setEmergencyContact] = useState('')
  const [bloodType, setBloodType] = useState('')
  const [allergies, setAllergies] = useState('')
  const [specialNotes, setSpecialNotes] = useState('')
  const [experience, setExperience] = useState('')
  const [certifications, setCertifications] = useState('')
  const [salary, setSalary] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [bankAccount, setBankAccount] = useState('')

  const { createDriver } = useDriverStore()

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Solo guardar la referencia del archivo, no subirlo aún
      setPhotoFile(file)
    }
  }

  const handleAddContact = () => {
    setContacts([...contacts, { type: 'PHONE', value: '' }])
  }

  const handleRemoveContact = (index: number) => {
    const updatedContacts = contacts.filter((_, i) => i !== index)
    setContacts(updatedContacts)
  }

  const handleContactChange = (index: number, field: 'type' | 'value', value: string) => {
    const updatedContacts = [...contacts]
    updatedContacts[index][field] = value as any
    setContacts(updatedContacts)
  }

  const validateDriverPayload = () => {
    if (!name.trim()) {
      showNotification('El nombre es requerido', 'error')
      return false
    }
    if (!licenseNumber.trim()) {
      showNotification('El número de licencia es requerido', 'error')
      return false
    }
    if (!address.street.trim()) {
      showNotification('La calle es requerida', 'error')
      return false
    }
    if (!address.city.trim()) {
      showNotification('La ciudad es requerida', 'error')
      return false
    }
    if (!address.state.trim()) {
      showNotification('El estado es requerido', 'error')
      return false
    }
    if (!address.postal_code.trim()) {
      showNotification('El código postal es requerido', 'error')
      return false
    }
    return true
  }

  const handleSubmit = async () => {
    if (!currentTeam) {
      showNotification('No se encontró el equipo actual', 'error')
      return
    }

    if (!validateDriverPayload()) return

    const newDriver = {
      name,
      photoUrl: 'https://via.placeholder.com/300x300?text=Sin+Foto', // Placeholder por defecto
      licenseNumber,
      address,
      contacts,
      teamId: currentTeam.id,
      status,
      curp: curp || undefined,
      rfc: rfc || undefined,
      birthDate: birthDate ? birthDate.toISOString().split('T')[0] : undefined,
      licenseExpiry: licenseExpiry ? licenseExpiry.toISOString().split('T')[0] : undefined,
      medicalExpiry: medicalExpiry ? medicalExpiry.toISOString().split('T')[0] : undefined,
      emergencyContact: emergencyContact || undefined,
      bloodType: bloodType || undefined,
      allergies: allergies || undefined,
      specialNotes: specialNotes || undefined,
      experience: experience || undefined,
      certifications: certifications || undefined,
      salary: salary || undefined,
      paymentMethod: paymentMethod || undefined,
      bankAccount: bankAccount || undefined,
    }

    const success = await createDriver(newDriver, photoFile || undefined)
    if (success) {
      showNotification('Conductor creado exitosamente', 'success')
      setVisible(false)
      resetForm()
    } else {
      showNotification('Error al crear el conductor', 'error')
    }
  }

  const resetForm = () => {
    setName('')
    setPhotoFile(null)
    setLicenseNumber('')
    setStatus('DISPONIBLE')
    setAddress({
      street: '',
      exterior_number: '',
      interior_number: '',
      neighborhood: '',
      city: '',
      state: '',
      country: 'México',
      postal_code: '',
    })
    setContacts([])
    setCurp('')
    setRfc('')
    setBirthDate(null)
    setLicenseExpiry(null)
    setMedicalExpiry(null)
    setEmergencyContact('')
    setBloodType('')
    setAllergies('')
    setSpecialNotes('')
    setExperience('')
    setCertifications('')
    setSalary(null)
    setPaymentMethod('')
    setBankAccount('')
  }

  const headerContent = (
    <div className='flex gap-3 p-4'>
      <span className='text-xl font-medium'>Agregar Conductor</span>
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
        Agregar Conductor
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
              <label className='block text-sm font-medium mb-1'>Nombre *</label>
              <InputText
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='w-full'
                placeholder='Nombre completo del conductor'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Foto de Perfil</label>
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

            <div>
              <label className='block text-sm font-medium mb-1'>Número de Licencia *</label>
              <InputText
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className='w-full'
                placeholder='Número de licencia de conducir'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Estatus</label>
              <Dropdown
                value={status}
                options={driverStatusOptions.map((s) => ({ label: s.replace('_', ' '), value: s }))}
                onChange={(e) => setStatus(e.value)}
                className='w-full'
                placeholder='Seleccionar estatus'
              />
            </div>
          </div>

          {/* Información Personal */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold border-b pb-2'>Información Personal</h3>

            <div>
              <label className='block text-sm font-medium mb-1'>CURP</label>
              <InputText
                value={curp}
                onChange={(e) => setCurp(e.target.value)}
                className='w-full'
                placeholder='CURP del conductor'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>RFC</label>
              <InputText
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
                className='w-full'
                placeholder='RFC del conductor'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Fecha de Nacimiento</label>
              <Calendar
                value={birthDate}
                onChange={(e) => setBirthDate(e.value || null)}
                className='w-full'
                showIcon
                dateFormat='dd/mm/yy'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Tipo de Sangre</label>
              <InputText
                value={bloodType}
                onChange={(e) => setBloodType(e.target.value)}
                className='w-full'
                placeholder='Ej: O+'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Alergias</label>
              <InputText
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                className='w-full'
                placeholder='Especifique alergias'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Contacto de Emergencia</label>
              <InputText
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                className='w-full'
                placeholder='Nombre y teléfono'
              />
            </div>
          </div>

          {/* Información de Licencia y Médica */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold border-b pb-2'>Licencia y Médica</h3>

            <div>
              <label className='block text-sm font-medium mb-1'>Vencimiento de Licencia</label>
              <Calendar
                value={licenseExpiry}
                onChange={(e) => setLicenseExpiry(e.value || null)}
                className='w-full'
                showIcon
                dateFormat='dd/mm/yy'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Vencimiento Médico</label>
              <Calendar
                value={medicalExpiry}
                onChange={(e) => setMedicalExpiry(e.value || null)}
                className='w-full'
                showIcon
                dateFormat='dd/mm/yy'
              />
            </div>
          </div>

          {/* Información Laboral */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold border-b pb-2'>Información Laboral</h3>

            <div>
              <label className='block text-sm font-medium mb-1'>Experiencia</label>
              <InputText
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className='w-full'
                placeholder='Ej: 5 años'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Certificaciones</label>
              <InputText
                value={certifications}
                onChange={(e) => setCertifications(e.target.value)}
                className='w-full'
                placeholder='Certificaciones adicionales'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Salario</label>
              <InputNumber
                value={salary}
                onValueChange={(e) => setSalary(e.value || null)}
                className='w-full'
                mode='currency'
                currency='MXN'
                locale='es-MX'
                placeholder='Salario mensual'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Método de Pago</label>
              <InputText
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className='w-full'
                placeholder='Ej: Transferencia bancaria'
              />
            </div>

            <div>
              <label className='block text-sm font-medium mb-1'>Información Bancaria</label>
              <InputTextarea
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className='w-full'
                rows={3}
                placeholder='Banco, cuenta, CLABE, etc.'
              />
            </div>
          </div>

          {/* Dirección */}
          <div className='space-y-4 md:col-span-2'>
            <h3 className='text-lg font-semibold border-b pb-2'>Dirección</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium mb-1'>Calle *</label>
                <InputText
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className='w-full'
                  placeholder='Nombre de la calle'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Número Exterior *</label>
                <InputText
                  value={address.exterior_number}
                  onChange={(e) => setAddress({ ...address, exterior_number: e.target.value })}
                  className='w-full'
                  placeholder='Número exterior'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Número Interior</label>
                <InputText
                  value={address.interior_number}
                  onChange={(e) => setAddress({ ...address, interior_number: e.target.value })}
                  className='w-full'
                  placeholder='Número interior (opcional)'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Colonia</label>
                <InputText
                  value={address.neighborhood}
                  onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                  className='w-full'
                  placeholder='Colonia o fraccionamiento'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Ciudad *</label>
                <InputText
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className='w-full'
                  placeholder='Ciudad'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Estado *</label>
                <InputText
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className='w-full'
                  placeholder='Estado'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>País</label>
                <InputText
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className='w-full'
                  placeholder='País'
                />
              </div>

              <div>
                <label className='block text-sm font-medium mb-1'>Código Postal *</label>
                <InputText
                  value={address.postal_code}
                  onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                  className='w-full'
                  placeholder='Código postal'
                />
              </div>
            </div>
          </div>

          {/* Contactos */}
          <div className='space-y-4 md:col-span-2'>
            <h3 className='text-lg font-semibold border-b pb-2'>Contactos</h3>
            <Button
              label='Agregar Contacto'
              icon='pi pi-plus'
              onClick={handleAddContact}
              className='p-button-outlined'
            />

            {contacts.map((contact, index) => (
              <div key={index} className='grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded'>
                <Dropdown
                  value={contact.type}
                  options={contactTypeOptions.map((t) => ({ label: t, value: t }))}
                  onChange={(e) => handleContactChange(index, 'type', e.value)}
                  placeholder='Tipo'
                />
                <InputText
                  value={contact.value}
                  onChange={(e) => handleContactChange(index, 'value', e.target.value)}
                  placeholder='Valor del contacto'
                />
                <Button
                  icon='pi pi-trash'
                  onClick={() => handleRemoveContact(index)}
                  className='p-button-danger p-button-outlined'
                  tooltip='Eliminar contacto'
                />
              </div>
            ))}
          </div>

          {/* Notas Especiales */}
          <div className='space-y-4 md:col-span-2'>
            <h3 className='text-lg font-semibold border-b pb-2'>Notas Especiales</h3>
            <InputTextarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              className='w-full'
              rows={4}
              placeholder='Notas especiales sobre el conductor...'
            />
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default DialogCreateDriver
