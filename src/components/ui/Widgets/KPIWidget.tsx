const data = {
  name: 'Viajes En proceso Febrero',
  stat: '10,450',
  change: '-12.5%',
  changeType: 'negative',
}

const KPIWidget = () => {
  return (
    <div
      className='w-full h-full rounded-lg border md:p-4 p-6 text-left shadow-sm bg-white  border-gray-200 z-10'
      data-swapy-item='c'
    >
      <dt className='text-sm font-medium text-gray-500 '>{data.name}</dt>
      <dd className='md:mt-0 mt-2 flex items-baseline space-x-2.5'>
        <span className='text-3xl font-semibold text-gray-900 '>{data.stat}</span>
        <span
          className={`
            ${data.changeType === 'positive' ? 'text-emerald-700 ' : 'text-red-700 '}
            'text-sm font-medium'
         `}
        >
          {data.change}
        </span>
      </dd>
    </div>
  )
}

export default KPIWidget
