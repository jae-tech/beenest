import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts'

interface RevenueData {
  month: string
  revenue: number
}

interface RevenueChartProps {
  data: RevenueData[]
  className?: string
  showArea?: boolean
  height?: number
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    notation: 'compact',
    maximumFractionDigits: 0,
  }).format(value)
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
        <p className="text-sm font-medium text-gray-900">{`${label}`}</p>
        <p className="text-sm text-blue-600">
          <span className="font-medium">매출: </span>
          {formatCurrency(payload[0].value)}
        </p>
      </div>
    )
  }
  return null
}

export const RevenueChart = ({
  data,
  className = '',
  showArea = true,
  height = 300,
}: RevenueChartProps) => {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 매출 현황</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          데이터가 없습니다.
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-lg p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
          <div className="flex items-center space-x-4 mt-2">
            <span className="text-2xl font-bold text-gray-900">₩{formatCurrency(data.reduce((sum, d) => sum + d.revenue, 0)).replace('₩', '')}</span>
            <span className="text-sm font-medium text-green-600">
              +15% Compared to last month
            </span>
          </div>
        </div>
        <button className="border border-gray-200 px-3 py-1 rounded text-sm cursor-pointer whitespace-nowrap hover:bg-gray-50">
          <i className="fas fa-calendar mr-2"></i>
          Monthly
        </button>
      </div>

      <div style={{ width: '100%', height: height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
              tickFormatter={(value) => `₩${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#eab308"
              strokeWidth={2}
              fill="#eab308"
              fillOpacity={0.1}
              dot={{ fill: '#eab308', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#eab308' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center space-x-6 mt-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Profit</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-400 rounded-full"></div>
          <span className="text-sm text-gray-600">Investment</span>
        </div>
      </div>
    </div>
  )
}