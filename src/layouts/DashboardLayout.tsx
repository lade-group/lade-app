import { useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../components/layout/Sidebar/Sidebar'
import Header from '../components/layout/Header/Header'

const DashboardLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div className='flex flex-row h-screen'>
      <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      <div className='flex-grow bg-light m-10'>
        <Header isCollapsed={isCollapsed} />
        <div
          className={`${isCollapsed ? 'pl-[6rem] delay-200' : 'pl-[16rem]'} body flex-grow-1 pt-15 pr-10`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout
