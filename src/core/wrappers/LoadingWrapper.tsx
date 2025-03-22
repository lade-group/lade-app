import { Suspense, PropsWithChildren } from 'react'
import { LinearProgress } from '@mui/material'

const FallBackLoader = () => {
  return (
    <div className='h-full flex justify-center items-center'>
      <LinearProgress />
    </div>
  )
}

const LoadingWrapper = ({ children }: PropsWithChildren) => {
  return <Suspense fallback={<FallBackLoader />}>{children}</Suspense>
}

export default LoadingWrapper
