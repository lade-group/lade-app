import { Steps } from 'primereact/steps'
import { useState } from 'react'
import TeamNameStep from './steps/TeamNameStep'
import TeamLogoStep from './steps/TeamLogoStep'
import TeamAddressStep from './steps/TeamAddressStep'
import TeamInviteStep from './steps/TeamInviteStep'
import TeamPlanStep from './steps/TeamPlanStep'
import { useNavigate } from 'react-router'

const CreateTeamWizardPage = () => {
  const navigate = useNavigate()

  const [activeStep, setActiveStep] = useState(0)
  const [teamData, setTeamData] = useState<any>({
    name: '',
    logo: '',
    address: {
      street: '',
      exterior_number: '',
      interior_number: '',
      neighborhood: '',
      city: '',
      state: '',
      country: '',
      postal_code: '',
    },
    invites: [] as string[],
    plan: '',
  })

  const steps = [
    { label: 'Nombre' },
    { label: 'Logo' },
    { label: 'Dirección' },
    { label: 'Invitaciones' },
    { label: 'Planes' },
  ]

  const next = () => setActiveStep((prev) => Math.min(prev + 1, 4))
  const back = () => setActiveStep((prev) => Math.max(prev - 1, 0))

  const handleNavigateToTeamPage = () => navigate('/equipos')

  const renderStep = () => {
    switch (activeStep) {
      case 0:
        return (
          <TeamNameStep
            data={teamData}
            setData={setTeamData}
            next={next}
            back={handleNavigateToTeamPage}
          />
        )
      case 1:
        return <TeamLogoStep data={teamData} setData={setTeamData} next={next} back={back} />
      case 2:
        return <TeamAddressStep data={teamData} setData={setTeamData} next={next} back={back} />
      case 3:
        return <TeamInviteStep data={teamData} setData={setTeamData} next={next} back={back} />
      case 4:
        return <TeamPlanStep data={teamData} setData={setTeamData} back={back} />
      default:
        return null
    }
  }

  return (
    <div className='min-h-screen  max-w-3xl mx-auto px-4 pt-10 text-primary'>
      <Steps model={steps} activeIndex={activeStep} readOnly />
      <div className='mt-10'>{renderStep()}</div>
    </div>
  )
}

export default CreateTeamWizardPage
