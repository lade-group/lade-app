import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Button } from 'primereact/button'
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog'
import { useInvoiceStore } from '../../../core/store/InvoiceStore'
import { useNotification } from '../../../core/contexts/NotificationContext'
import InvoiceStatusTag from '../../../components/ui/Tag/InvoiceStatusTag'
import Accordion from '../../../components/ui/Acoordion/Accordion'

const Invoice = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { showNotification } = useNotification()
  const { currentInvoice, getInvoice, stampInvoice, cancelInvoice, loading } = useInvoiceStore()

  useEffect(() => {
    console.log('id', id)
    if (id) {
      getInvoice(id)
    }
  }, [])

  const handleStampInvoice = async () => {
    if (!currentInvoice) return

    const success = await stampInvoice(currentInvoice.id)
    if (success) {
      showNotification('Factura timbrada exitosamente', 'success')
    } else {
      showNotification('Error al timbrar la factura', 'error')
    }
  }

  const handleCancelInvoice = async () => {
    if (!currentInvoice) return

    const success = await cancelInvoice(currentInvoice.id)
    if (success) {
      showNotification('Factura cancelada exitosamente', 'success')
    } else {
      showNotification('Error al cancelar la factura', 'error')
    }
  }

  const handleDownloadPdf = () => {
    if (currentInvoice?.localPdfUrl) {
      window.open(currentInvoice.localPdfUrl, '_blank')
    }
  }

  const handleDownloadXml = () => {
    if (currentInvoice?.localXmlUrl) {
      window.open(currentInvoice.localXmlUrl, '_blank')
    }
  }

  const confirmStamp = () => {
    confirmDialog({
      message:
        '¿Estás seguro de que quieres timbrar esta factura? Esta acción no se puede deshacer.',
      header: 'Confirmar Timbrado',
      icon: 'pi pi-exclamation-triangle',
      accept: handleStampInvoice,
      acceptLabel: 'Timbrado',
      rejectLabel: 'Cancelar',
    })
  }

  const confirmCancel = () => {
    confirmDialog({
      message:
        '¿Estás seguro de que quieres cancelar esta factura? Esta acción no se puede deshacer.',
      header: 'Confirmar Cancelación',
      icon: 'pi pi-exclamation-triangle',
      accept: handleCancelInvoice,
      acceptLabel: 'Cancelar Factura',
      rejectLabel: 'No Cancelar',
      acceptClassName: 'p-button-danger',
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (!currentInvoice) {
    return (
      <div className='text-center py-12'>
        <h2 className='text-2xl font-semibold text-gray-600'>Factura no encontrada</h2>
        <Button
          label='Volver a Facturas'
          icon='pi pi-arrow-left'
          onClick={() => navigate('/dashboard/invoices')}
          className='mt-4'
        />
      </div>
    )
  }

  return (
    <div className='space-y-6'>
      <ConfirmDialog />

      {/* Header */}
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl text-primary font-bold'>Factura #{currentInvoice.id || 'N/A'}</h1>
          <p className='text-lg text-gray-600 mt-2'>Detalles completos de la factura</p>
        </div>
        <div className='flex gap-2'>
          <Button
            label='Volver'
            icon='pi pi-arrow-left'
            severity='secondary'
            outlined
            onClick={() => navigate('/dashboard/invoices')}
          />
          {currentInvoice.status === 'DRAFT' && (
            <Button
              label='Timbrado'
              icon='pi pi-check-circle'
              severity='success'
              onClick={confirmStamp}
            />
          )}
          {currentInvoice.status === 'STAMPED' && (
            <>
              <Button
                label='Descargar PDF'
                icon='pi pi-download'
                severity='info'
                onClick={handleDownloadPdf}
              />
              <Button
                label='Descargar XML'
                icon='pi pi-download'
                severity='warning'
                onClick={handleDownloadXml}
              />
              <Button
                label='Cancelar'
                icon='pi pi-times'
                severity='danger'
                outlined
                onClick={confirmCancel}
              />
            </>
          )}
        </div>
      </div>

      {/* Invoice Information */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
        <div className='lg:col-span-2'>
          <Accordion title='Información de la Factura' defaultOpen={true}>
            <div className='space-y-4'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <span className='font-medium text-gray-600'>Estado:</span>
                  <div className='mt-1'>
                    <InvoiceStatusTag status={currentInvoice.status} />
                  </div>
                </div>
                <div>
                  <span className='font-medium text-gray-600'>Número de Factura:</span>
                  <p className='mt-1'>{currentInvoice.invoiceNumber || 'N/A'}</p>
                </div>
                <div>
                  <span className='font-medium text-gray-600'>Folio:</span>
                  <p className='mt-1'>{currentInvoice.folio || 'N/A'}</p>
                </div>
                <div>
                  <span className='font-medium text-gray-600'>UUID:</span>
                  <p className='mt-1 text-sm font-mono'>{currentInvoice.uuid || 'N/A'}</p>
                </div>
                <div>
                  <span className='font-medium text-gray-600'>Subtotal:</span>
                  <p className='mt-1'>{formatCurrency(currentInvoice.subtotal)}</p>
                </div>
                <div>
                  <span className='font-medium text-gray-600'>IVA:</span>
                  <p className='mt-1'>{formatCurrency(currentInvoice.taxAmount)}</p>
                </div>
                <div className='col-span-2'>
                  <span className='font-medium text-gray-600'>Total:</span>
                  <p className='mt-1 text-xl font-bold text-primary'>
                    {formatCurrency(currentInvoice.total)}
                  </p>
                </div>
              </div>
              <div>
                <span className='font-medium text-gray-600'>Fecha de Creación:</span>
                <p className='mt-1'>{formatDate(currentInvoice.createdAt)}</p>
              </div>
              {currentInvoice.notes && (
                <div>
                  <span className='font-medium text-gray-600'>Notas:</span>
                  <p className='mt-1'>{currentInvoice.notes}</p>
                </div>
              )}
            </div>
          </Accordion>
        </div>

        <div>
          <Accordion title='Información del Viaje' defaultOpen={true}>
            <div className='space-y-4'>
              <div>
                <span className='font-medium text-gray-600'>Cliente:</span>
                <p className='mt-1'>{currentInvoice.trip.client.name}</p>
                {currentInvoice.trip.client.name_related && (
                  <p className='text-sm text-gray-500'>{currentInvoice.trip.client.name_related}</p>
                )}
              </div>
              <div>
                <span className='font-medium text-gray-600'>Conductor:</span>
                <div className='flex items-center gap-2 mt-1'>
                  <img
                    src={currentInvoice.trip.driver.photoUrl || '/placeholder-driver.jpg'}
                    alt={currentInvoice.trip.driver.name}
                    className='w-8 h-8 rounded-full object-cover'
                  />
                  <span>{currentInvoice.trip.driver.name}</span>
                </div>
              </div>
              <div>
                <span className='font-medium text-gray-600'>Vehículo:</span>
                <div className='flex items-center gap-2 mt-1'>
                  <img
                    src={currentInvoice.trip.vehicle.imageUrl || '/placeholder-vehicle.jpg'}
                    alt={currentInvoice.trip.vehicle.plate}
                    className='w-8 h-8 rounded object-cover'
                  />
                  <span>{currentInvoice.trip.vehicle.plate}</span>
                </div>
                <p className='text-sm text-gray-500 mt-1'>
                  {currentInvoice.trip.vehicle.brand} {currentInvoice.trip.vehicle.model}
                </p>
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </div>
  )
}

export default Invoice
