import WidgetScreenManager from '../../../components/features/dashboard/home/WidgetScreenManager'

const Home = () => {
  return (
    <div>
      <div className='flex justify-between'>
        <h1 className='text-4xl text-primary font-bold'>Bienvenido Diego</h1>
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
