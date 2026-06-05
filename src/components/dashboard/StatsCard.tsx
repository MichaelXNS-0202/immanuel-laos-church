interface StatsCardProps {
  label: string
  value: string | number
  icon?: string
  color?: 'orange' | 'blue' | 'green' | 'yellow' | 'red' | 'gray'
}

const colorClasses = {
  orange: 'bg-orange-50 border-orange-100',
  blue: 'bg-blue-50 border-blue-100',
  green: 'bg-green-50 border-green-100',
  yellow: 'bg-yellow-50 border-yellow-100',
  red: 'bg-red-50 border-red-100',
  gray: 'bg-gray-50 border-gray-100',
}

const valueColorClasses = {
  orange: 'text-orange-600',
  blue: 'text-blue-600',
  green: 'text-green-600',
  yellow: 'text-yellow-600',
  red: 'text-red-600',
  gray: 'text-gray-600',
}

export function StatsCard({ label, value, icon, color = 'gray' }: StatsCardProps) {
  return (
    <div className={`rounded-xl border p-5 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600">{label}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className={`text-3xl font-bold ${valueColorClasses[color]}`}>{value}</div>
    </div>
  )
}
