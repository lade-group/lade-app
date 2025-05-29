// src/components/ui/Tag/LogActionTag.tsx
import Tag from './Tag'

interface LogActionTagProps {
  action: 'CREATE' | 'UPDATE' | 'DELETE'
  mini?: boolean
}

const actionColorMap: Record<LogActionTagProps['action'], string> = {
  CREATE: 'bg-green-100 text-green-800',
  UPDATE: 'bg-yellow-100 text-yellow-800',
  DELETE: 'bg-red-100 text-red-800',
}

const LogActionTag = ({ action, mini = false }: LogActionTagProps) => {
  const label = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase()
  return <Tag label={label} colorClass={actionColorMap[action]} mini={mini} />
}

export default LogActionTag
