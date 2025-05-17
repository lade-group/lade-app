interface BaseTagProps {
  label: string
  colorClass?: string
  icon?: React.ReactNode
  mini?: boolean
  onClick?: () => void
}

const Tag = ({ label, colorClass = '', icon, mini = false, onClick }: BaseTagProps) => {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${
        mini ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'
      } ${colorClass} ${onClick ? 'cursor-pointer hover:opacity-90' : ''}`}
      onClick={onClick}
    >
      {icon && <span className='text-sm'>{icon}</span>}
      {label}
    </span>
  )
}

export default Tag
