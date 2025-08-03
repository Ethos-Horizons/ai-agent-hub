import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { 
  Activity, 
  Clock, 
  TrendingUp, 
  AlertCircle, 
  Play, 
  Pause, 
  Settings,
  BarChart3,
  MessageSquare,
  FileText
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  type: string
  description: string
  status: 'active' | 'inactive' | 'training' | 'error'
  version: string
  createdAt: string
  config: {
    model: string
    temperature: number
    maxTokens: number
  }
  performance: {
    totalTasks: number
    completedTasks: number
    successRate: number
    averageResponseTime: number
  }
}

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>()
  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - replace with actual API call
    const fetchAgent = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockAgent: Agent = {
          id: id || '1',
          name: 'Website Chatbot',
          type: 'Customer Service',
          description: 'AI chatbot for website visitor assistance',
          status: 'active',
          version: '1.0.0',
          createdAt: '2024-01-15T10:30:00Z',
          config: {
            model: 'gemini-1.5-flash',
            temperature: 0.7,
            maxTokens: 1000
          },
          performance: {
            totalTasks: 156,
            completedTasks: 147,
            successRate: 94.2,
            averageResponseTime: 2.3
          }
        }
        
        setAgent(mockAgent)
      } catch (error) {
        console.error('Error fetching agent:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAgent()
  }, [id])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      case 'training': return 'text-blue-600 bg-blue-100'
      case 'error': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Activity className="w-4 h-4" />
      case 'inactive': return <Pause className="w-4 h-4" />
      case 'training': return <TrendingUp className="w-4 h-4" />
      case 'error': return <AlertCircle className="w-4 h-4" />
      default: return <Pause className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!agent) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Agent not found</h3>
        <p className="mt-1 text-sm text-gray-500">The agent you're looking for doesn't exist.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{agent.name}</h1>
          <p className="mt-1 text-sm text-gray-500">{agent.description}</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
            {getStatusIcon(agent.status)}
            <span className="ml-1 capitalize">{agent.status}</span>
          </span>
          <button className="btn-secondary">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Performance Overview */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Overview</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{agent.performance.totalTasks}</div>
                <div className="text-sm text-gray-500">Total Tasks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{agent.performance.completedTasks}</div>
                <div className="text-sm text-gray-500">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{agent.performance.successRate}%</div>
                <div className="text-sm text-gray-500">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{agent.performance.averageResponseTime}s</div>
                <div className="text-sm text-gray-500">Avg Response</div>
              </div>
            </div>
          </div>

          {/* Configuration */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">AI Model</label>
                <div className="text-sm text-gray-900">{agent.config.model}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Temperature</label>
                <div className="text-sm text-gray-900">{agent.config.temperature}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Tokens</label>
                <div className="text-sm text-gray-900">{agent.config.maxTokens}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                <div className="text-sm text-gray-900">{agent.version}</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">Task completed successfully</div>
                  <div className="text-xs text-gray-500">2 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">New conversation started</div>
                  <div className="text-xs text-gray-500">5 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">Configuration updated</div>
                  <div className="text-xs text-gray-500">1 hour ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full btn-primary">
                <Play className="w-4 h-4 mr-2" />
                Start Agent
              </button>
              <button className="w-full btn-secondary">
                <Pause className="w-4 h-4 mr-2" />
                Pause Agent
              </button>
              <button className="w-full btn-secondary">
                <TrendingUp className="w-4 h-4 mr-2" />
                Train Agent
              </button>
            </div>
          </div>

          {/* Agent Info */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Information</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <div className="text-sm text-gray-900">{agent.type}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                <div className="text-sm text-gray-900">
                  {new Date(agent.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Activity</label>
                <div className="text-sm text-gray-900">2 minutes ago</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MessageSquare className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Conversations</span>
                </div>
                <span className="text-sm font-medium text-gray-900">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Documents</span>
                </div>
                <span className="text-sm font-medium text-gray-900">89</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">Analytics</span>
                </div>
                <span className="text-sm font-medium text-gray-900">156</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 