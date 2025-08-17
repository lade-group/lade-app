import { useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { InputNumber } from 'primereact/inputnumber'
import { InputTextarea } from 'primereact/inputtextarea'
import { Dropdown } from 'primereact/dropdown'
import { useClientStore } from '../../../../core/store/ClientStore'
import { useTeamStore } from '../../../../core/store/TeamStore'
import { useNotification } from '../../../../core/contexts/NotificationContext'

const DialogCreateClients = () => {
  const [visible, setVisible] = useState(false)
  const createClient = useClientStore((state) => state.createClient)
  const { currentTeam } = useTeamStore()
  const { showNotification } = useNotification()

  const [clientType, setClientType] = useState('')
  const [nombreFiscal, setNombreFiscal] = useState('')
  const [nombreReferencia, setNombreReferencia] = useState('')
  const [rfc, setRfc] = useState('')
  const [curp, setCurp] = useState('')
  const [descripcion, setDescripcion] = useState('')

  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')

  const [street, setStreet] = useState('')
  const [exteriorNumber, setExteriorNumber] = useState('')
  const [interiorNumber, setInteriorNumber] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('México')
  const [postalCode, setPostalCode] = useState('')

  // Nuevos campos de logística
  const [creditLimit, setCreditLimit] = useState<number | null>(null)
  const [paymentTerms, setPaymentTerms] = useState('')
  const [preferredPaymentMethod, setPreferredPaymentMethod] = useState('')
  const [businessType, setBusinessType] = useState('')
  const [industry, setIndustry] = useState('')
  const [specialRequirements, setSpecialRequirements] = useState('')
  const [notes, setNotes] = useState('')

  const clientTypeOptions = [
    { label: 'Nacional', value: 'nacional' },
    { label: 'Internacional', value: 'internacional' },
  ]

  const validateClientPayload = (payload: any): string[] => {
    const errors: string[] = []

    // Campos principales
    if (!payload.name || payload.name.trim() === '') {
      errors.push('El nombre fiscal es obligatorio.')
    }

    if (!payload.rfc || !/^([A-ZÑ&]{3,4})\d{6}[A-Z0-9]{3}$/i.test(payload.rfc)) {
      errors.push('El RFC es inválido.')
    }

    if (!payload.email || !/\S+@\S+\.\S+/.test(payload.email)) {
      errors.push('El correo electrónico es inválido.')
    }

    if (!payload.phone || !/^\d{10}$/.test(payload.phone)) {
      errors.push('El teléfono debe tener 10 dígitos.')
    }

    if (!payload.zipCode || !/^\d{5}$/.test(payload.zipCode)) {
      errors.push('El código postal es inválido.')
    }

    if (!payload.teamId || typeof payload.teamId !== 'string') {
      errors.push('El ID del equipo es inválido.')
    }

    // Dirección
    const address = payload.address
    if (!address) {
      errors.push('La dirección es obligatoria.')
    } else {
      if (!address.street || address.street.trim() === '') {
        errors.push('La calle es obligatoria.')
      }
      if (!address.exterior_number || address.exterior_number.trim() === '') {
        errors.push('El número exterior es obligatorio.')
      }
      if (!address.neighborhood || address.neighborhood.trim() === '') {
        errors.push('La colonia es obligatoria.')
      }
      if (!address.city || address.city.trim() === '') {
        errors.push('La ciudad es obligatoria.')
      }
      if (!address.state || address.state.trim() === '') {
        errors.push('El estado es obligatorio.')
      }
      if (!address.country || address.country.trim() === '') {
        errors.push('El país es obligatorio.')
      }
      if (!address.postal_code || !/^\d{5}$/.test(address.postal_code)) {
        errors.push('El código postal de la dirección es inválido.')
      }
    }

    return errors
  }

  const handleSubmit = async () => {
    console.log('Submitting form...')
    if (!currentTeam) return // Manejar error

    const payload = {
      name: nombreFiscal,
      name_related: nombreReferencia,
      rfc,
      description: descripcion,
      email,
      phone,
      cfdiUse: 'G03',
      taxRegime: '601',
      zipCode: postalCode,
      teamId: currentTeam.id,
      creditLimit: creditLimit || undefined,
      paymentTerms,
      preferredPaymentMethod,
      businessType,
      industry,
      specialRequirements,
      notes,
      address: {
        street,
        exterior_number: exteriorNumber,
        interior_number: interiorNumber,
        neighborhood,
        city,
        state,
        country,
        postal_code: postalCode,
      },
      contacts: [],
    }
    const errors = validateClientPayload(payload)
    if (errors.length > 0) {
      showNotification('Errores encontrados:\n' + errors.join('\n'), 'error')
      return
    }
    const success = await createClient(payload)

    if (success) {
      showNotification('Cliente Creado exitosamente', 'success')
      setVisible(false)
      // Limpiar formulario
      setNombreFiscal('')
      setNombreReferencia('')
      setRfc('')
      setCurp('')
      setDescripcion('')
      setStreet('')
      setExteriorNumber('')
      setInteriorNumber('')
      setNeighborhood('')
      setCity('')
      setState('')
      setCountry('México')
      setPostalCode('')
      setClientType('')
      setCreditLimit(null)
      setPaymentTerms('')
      setPreferredPaymentMethod('')
      setBusinessType('')
      setIndustry('')
      setSpecialRequirements('')
      setNotes('')
    }
  }

  const footerContent = (
    <div className='flex gap-5 justify-end px-10 pb-4'>
      <Button
        label='Cancelar'
        icon='pi pi-times'
        onClick={() => setVisible(false)}
        className='p-button-secondary'
      />
      <Button
        label='Guardar'
        icon='pi pi-check'
        onClick={handleSubmit}
        className='p-button-success'
      />
    </div>
  )

  const headerContent = (
    <div className='flex gap-5 p-10 items-center'>
      <span className='text-xl font-semibold'>Crear Cliente Nuevo</span>
      <i className='pi pi-handshake text-2xl text-primary'></i>
    </div>
  )

  return (
    <div className='card flex justify-content-center'>
      <div
        className='bg-primary hover:bg-primary-hover text-white text-center font-medium px-6 py-3 w-full rounded-md transition cursor-pointer'
        onClick={() => setVisible(true)}
        id='create-client-button'
      >
        Agregar Cliente
      </div>

      <Dialog
        header={headerContent}
        visible={visible}
        style={{ width: '70vw' }}
        onHide={() => setVisible(false)}
        footer={footerContent}
        maximizable
      >
        <div className='p-6'>
          <div className='grid grid-cols-6 gap-5'>
            {/* Información Básica */}
            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='nombreFiscal'>Nombre Fiscal *</label>
              <InputText
                id='nombreFiscal'
                value={nombreFiscal}
                onChange={(e) => setNombreFiscal(e.target.value)}
                placeholder='Nombre fiscal de la empresa'
              />
            </div>
            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='nombreReferencia'>Apodo / Nombre Referencia</label>
              <InputText
                id='nombreReferencia'
                value={nombreReferencia}
                onChange={(e) => setNombreReferencia(e.target.value)}
                placeholder='Nombre comercial o de referencia'
              />
            </div>

            <div className='col-span-2 flex flex-col gap-2'>
              <label htmlFor='clientType'>Tipo de Cliente</label>
              <Dropdown
                id='clientType'
                value={clientType}
                options={clientTypeOptions}
                onChange={(e) => setClientType(e.value)}
                placeholder='Seleccionar tipo'
              />
            </div>

            <div className='col-span-2 flex flex-col gap-2'>
              <label htmlFor='rfc'>RFC *</label>
              <InputText
                id='rfc'
                value={rfc}
                onChange={(e) => setRfc(e.target.value)}
                placeholder='RFC de la empresa'
              />
            </div>
            <div className='col-span-2 flex flex-col gap-2'>
              <label htmlFor='curp'>CURP</label>
              <InputText
                id='curp'
                value={curp}
                onChange={(e) => setCurp(e.target.value)}
                placeholder='CURP (opcional)'
              />
            </div>

            <div className='col-span-6 flex flex-col gap-2'>
              <label htmlFor='descripcion'>Descripción de la Empresa</label>
              <InputTextarea
                id='descripcion'
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                rows={3}
                placeholder='Descripción de la empresa y sus actividades'
              />
            </div>

            {/* Información de Contacto */}
            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='email'>Correo Electrónico *</label>
              <InputText
                id='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='correo@empresa.com'
              />
            </div>
            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='phone'>Teléfono *</label>
              <InputText
                id='phone'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder='10 dígitos'
              />
            </div>

            {/* Dirección */}
            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='street'>Calle *</label>
              <InputText
                id='street'
                value={street}
                onChange={(e) => setStreet(e.target.value)}
                placeholder='Nombre de la calle'
              />
            </div>
            <div className='col-span-1 flex flex-col gap-2'>
              <label htmlFor='exteriorNumber'>Número Exterior *</label>
              <InputText
                id='exteriorNumber'
                value={exteriorNumber}
                onChange={(e) => setExteriorNumber(e.target.value)}
                placeholder='123'
              />
            </div>
            <div className='col-span-2 flex flex-col gap-2'>
              <label htmlFor='interiorNumber'>Número Interior</label>
              <InputText
                id='interiorNumber'
                value={interiorNumber}
                onChange={(e) => setInteriorNumber(e.target.value)}
                placeholder='Apto 5 (opcional)'
              />
            </div>

            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='neighborhood'>Colonia *</label>
              <InputText
                id='neighborhood'
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder='Nombre de la colonia'
              />
            </div>
            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='city'>Ciudad / Municipio *</label>
              <InputText
                id='city'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder='Nombre de la ciudad'
              />
            </div>

            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='state'>Estado *</label>
              <InputText
                id='state'
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder='Nombre del estado'
              />
            </div>
            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='country'>País *</label>
              <InputText
                id='country'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder='País'
              />
            </div>
            <div className='col-span-2 flex flex-col gap-2'>
              <label htmlFor='postalCode'>Código Postal *</label>
              <InputText
                id='postalCode'
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder='12345'
              />
            </div>

            {/* Información de Logística */}
            <div className='col-span-2 flex flex-col gap-2'>
              <label htmlFor='creditLimit'>Límite de Crédito</label>
              <InputNumber
                id='creditLimit'
                value={creditLimit}
                onValueChange={(e) => setCreditLimit(e.value || null)}
                mode='currency'
                currency='MXN'
                locale='es-MX'
                placeholder='$0.00'
              />
            </div>
            <div className='col-span-2 flex flex-col gap-2'>
              <label htmlFor='paymentTerms'>Condiciones de Pago</label>
              <InputText
                id='paymentTerms'
                value={paymentTerms}
                onChange={(e) => setPaymentTerms(e.target.value)}
                placeholder='Ej: 30 días'
              />
            </div>
            <div className='col-span-2 flex flex-col gap-2'>
              <label htmlFor='preferredPaymentMethod'>Método de Pago Preferido</label>
              <InputText
                id='preferredPaymentMethod'
                value={preferredPaymentMethod}
                onChange={(e) => setPreferredPaymentMethod(e.target.value)}
                placeholder='Ej: Transferencia bancaria'
              />
            </div>

            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='businessType'>Tipo de Negocio</label>
              <InputText
                id='businessType'
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder='Ej: Importador, Distribuidor, Fabricante'
              />
            </div>
            <div className='col-span-3 flex flex-col gap-2'>
              <label htmlFor='industry'>Industria</label>
              <InputText
                id='industry'
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder='Ej: Automotriz, Alimentaria, Textil'
              />
            </div>

            <div className='col-span-6 flex flex-col gap-2'>
              <label htmlFor='specialRequirements'>Requisitos Especiales de Transporte</label>
              <InputTextarea
                id='specialRequirements'
                value={specialRequirements}
                onChange={(e) => setSpecialRequirements(e.target.value)}
                rows={3}
                placeholder='Requisitos especiales para el transporte de mercancías'
              />
            </div>

            <div className='col-span-6 flex flex-col gap-2'>
              <label htmlFor='notes'>Notas Adicionales</label>
              <InputTextarea
                id='notes'
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder='Notas adicionales sobre el cliente'
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  )
}

export default DialogCreateClients
