import { useState, useEffect } from 'react'
import { 
  Bot, 
  MessageSquare, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Activity,
  Users,
  DollarSign,
  Settings
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface Agent {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive' | 'error'
  lastActivity: string
  taskCount: number
  successRate: number
}

interface DashboardStats {
  totalAgents: number
  activeAgents: number
  totalTasks: number
  completedTasks: number
  totalConversations: number
  averageResponseTime: number
  monthlyCost: number
  leadConversionRate: number
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalAgents: 0,
    activeAgents: 0,
    totalTasks: 0,
    completedTasks: 0,
    totalConversations: 0,
    averageResponseTime: 0,
    monthlyCost: 0,
    leadConversionRate: 0
  })

  useEffect(() => {
    // Mock data - replace with actual API calls
    setAgents([
      {
        id: '1',
        name: 'Website Chatbot',
        type: 'Customer Service',
        status: 'active',
        lastActivity: '2 minutes ago',
        taskCount: 156,
        successRate: 94.2
      },
      {
        id: '2',
        name: 'Content Writer',
        type: 'Content Creation',
        status: 'active',
        lastActivity: '1 hour ago',
        taskCount: 23,
        successRate: 87.5
      },
      {
        id: '3',
        name: 'SEO Analyzer',
        type: 'Analytics',
        status: 'inactive',
        lastActivity: '3 days ago',
        taskCount: 8,
        successRate: 92.1
      }
    ])

    setStats({
      totalAgents: 3,
      activeAgents: 2,
      totalTasks: 187,
      completedTasks: 175,
      totalConversations: 342,
      averageResponseTime: 2.3,
      monthlyCost: 156.78,
      leadConversionRate: 23.5
    })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'status-active'
      case 'inactive':
        return 'status-inactive'
      case 'error':
        return 'status-error'
      default:
        return 'status-inactive'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'inactive':
        return <Clock className="h-4 w-4" />
      case 'error':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your AI agents.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Bot className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Active Agents</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.activeAgents}/{stats.totalAgents}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Activity className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Tasks Completed</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.completedTasks}/{stats.totalTasks}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Conversations</dt>
                <dd className="text-lg font-medium text-gray-900">{stats.totalConversations}</dd>
              </dl>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-error-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Monthly Cost</dt>
                <dd className="text-lg font-medium text-gray-900">${stats.monthlyCost}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Agent Status */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Agent Status</h3>
            <Link to="/agents" className="text-sm text-primary-600 hover:text-primary-500">
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Bot className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{agent.name}</p>
                    <p className="text-xs text-gray-500">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`status-badge ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    <span className="ml-1 capitalize">{agent.status}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
            <Link to="/analytics" className="text-sm text-primary-600 hover:text-primary-500">
              View details
            </Link>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Average Response Time</span>
              <span className="text-sm font-medium text-gray-900">{stats.averageResponseTime}s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Lead Conversion Rate</span>
              <span className="text-sm font-medium text-gray-900">{stats.leadConversionRate}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Task Success Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {Math.round((stats.completedTasks / stats.totalTasks) * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/agents/new"
            className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Bot className="h-5 w-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Create Agent</span>
          </Link>
          <Link
            to="/chatbot"
            className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <MessageSquare className="h-5 w-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Test Chatbot</span>
          </Link>
          <Link
            to="/analytics"
            className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <TrendingUp className="h-5 w-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">View Analytics</span>
          </Link>
          <Link
            to="/settings"
            className="flex items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-5 w-5 text-primary-600 mr-3" />
            <span className="text-sm font-medium text-gray-900">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
} 