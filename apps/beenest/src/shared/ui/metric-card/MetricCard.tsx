export interface MetricCardProps {
  icon: string
  title: string
  value: string
  change: string
  color: string
  trend: 'up' | 'down'
}

export const MetricCard = ({ icon, title, value, change, color, trend }: MetricCardProps) => (
  <div className="p-6 hover:shadow-lg transition-shadow cursor-pointer bg-white rounded-lg">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <i className={`${icon} text-xl text-white`}></i>
      </div>
      <i className="fas fa-external-link-alt text-gray-400 text-sm"></i>
    </div>
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-medium ${trend === "up" ? "text-green-600" : "text-red-600"}`}>
          {change}
        </span>
        <span className="text-xs text-gray-500">Since last month</span>
      </div>
    </div>
  </div>
)