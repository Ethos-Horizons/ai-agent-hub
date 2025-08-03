import { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Activity, DollarSign, Users, Clock } from 'lucide-react'
import axios from 'axios'

interface AnalyticsData {
  overview: {
    totalAgents: number
    activeAgents: number
    totalTasks: number
    completedTasks: number
    successRate: number
    averageResponseTime: number
    totalCost: number
  }
  agentPerformance: Array<{
    agentId: string
    agentName: string
    taskCount: number
    successRate: number
    averageResponseTime: number
    cost: number
  }>
  timeSeries: {
    labels: string[]
    tasks: number[]
    conversations: number[]
    leads: number[]
  }
}

export default function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      const response = await axios.get(`/api/analytics?timeRange=${timeRange}`)
      if (response.data.success) {
        setAnalytics(response.data.analytics)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No analytics data</h3>
        <p className="text-gray-500">Analytics data will appear here once you start using agents</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor performance and track system metrics
          </p>
        </div>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="input-field w-auto"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.totalTasks}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center">
              <span className="text-sm text-success-600 font-medium">
                {analytics.overview.completedTasks} completed
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-success-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.successRate}%</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-success-600 h-2 rounded-full"
                style={{ width: `${analytics.overview.successRate}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-warning-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.overview.averageResponseTime}s</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-error-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Cost</p>
              <p className="text-2xl font-bold text-gray-900">${analytics.overview.totalCost}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Performance */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Performance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agent
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Success Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Response Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cost
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analytics.agentPerformance.map((agent) => (
                <tr key={agent.agentId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{agent.agentName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.taskCount}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="text-sm text-gray-900 mr-2">{agent.successRate}%</span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-success-600 h-2 rounded-full"
                          style={{ width: `${agent.successRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{agent.averageResponseTime}s</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">${agent.cost}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Time Series Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Tasks Over Time</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.timeSeries.tasks.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-primary-600 rounded-t"
                  style={{ height: `${(value / Math.max(...analytics.timeSeries.tasks)) * 200}px` }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">{analytics.timeSeries.labels[index]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Conversations & Leads</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {analytics.timeSeries.conversations.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="flex flex-col space-y-1 w-full">
                  <div
                    className="w-full bg-primary-600 rounded-t"
                    style={{ height: `${(value / Math.max(...analytics.timeSeries.conversations)) * 100}px` }}
                  ></div>
                  <div
                    className="w-full bg-success-600 rounded-t"
                    style={{ height: `${(analytics.timeSeries.leads[index] / Math.max(...analytics.timeSeries.leads)) * 100}px` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500 mt-2">{analytics.timeSeries.labels[index]}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center space-x-4 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-600 rounded mr-2"></div>
              <span className="text-xs text-gray-500">Conversations</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-success-600 rounded mr-2"></div>
              <span className="text-xs text-gray-500">Leads</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 