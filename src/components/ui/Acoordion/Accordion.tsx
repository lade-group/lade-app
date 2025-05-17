import { useState } from 'react'

interface AccordionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

const Accordion = ({ title, children, defaultOpen = false }: AccordionProps) => {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className='border border-gray-300 rounded-lg  bg-white my-5'>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className='w-full px-4 py-4 text-left text-xl font-semibold text-primary flex justify-between items-center bg-gray-100 rounded-t-lg'
      >
        {title}
        <svg
          className={`w-5 h-5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill='none'
          stroke='currentColor'
          strokeWidth='2'
          viewBox='0 0 24 24'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19 9l-7 7-7-7' />
        </svg>
      </button>

      {open && <div className='px-4 pb-6 pt-4'>{children}</div>}
    </div>
  )
}

export default Accordion
