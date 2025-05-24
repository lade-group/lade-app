import WidgetScreenManager from '../../../components/features/dashboard/home/WidgetScreenManager'
import { useAuth } from '../../../core/contexts/AuthContext'
const Home = () => {
  const { currentUser } = useAuth()
  const teamName = localStorage.getItem('TeamName')
  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='text-4xl text-primary font-bold'>
          Bienvenido a {teamName}, {currentUser?.name} {currentUser?.father_last_name}.
        </h1>
      </div>
      <div>
        <span className='text-lg'>Visualiza los estados de tus proceos</span>
      </div>
      <div className='w-full'>
        <WidgetScreenManager />
      </div>
    </div>
  )
}

export default Home
