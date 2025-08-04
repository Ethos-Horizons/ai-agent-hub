import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { 
  Bot, 
  Eye, 
  Play, 
  Pause, 
  Trash2, 
  Plus,
  Settings,
  Activity,
  Clock,
  TrendingUp,
  AlertCircle
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  type: string
  description: string
  status: 'active' | 'inactive' | 'training' | 'error'
  version: string
  createdAt: string
  lastActivity?: string
  taskCount?: number
  successRate?: number
  config?: {
    model: string
    temperature: number
    maxTokens: number
  }
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/agents')
      setAgents(response.data.agents)
    } catch (error) {
      console.error('Error loading agents:', error)
      setError('Failed to load agents')
    } finally {
      setLoading(false)
    }
  }

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await axios.put(`/api/agents/${agentId}`, { status: newStatus })
      loadAgents() // Reload to get updated data
    } catch (error) {
      console.error('Error toggling agent status:', error)
    }
  }

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent? This action cannot be undone.')) {
      return
    }

    try {
      await axios.delete(`/api/agents/${agentId}`)
      loadAgents() // Reload to get updated data
    } catch (error) {
      console.error('Error deleting agent:', error)
    }
  }

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

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error loading agents</h3>
        <p className="mt-1 text-sm text-gray-500">{error}</p>
        <button
          onClick={loadAgents}
          className="mt-4 btn-primary"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Agents</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your AI agents
          </p>
        </div>
        <Link
          to="/agents/new"
          className="btn-primary"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Agent
        </Link>
      </div>

      {/* Agents Grid */}
      {agents.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No agents yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first AI agent.
          </p>
          <Link
            to="/agents/new"
            className="mt-4 btn-primary"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Agent
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <div key={agent.id} className="card">
              {/* Agent Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{agent.name}</h3>
                    <p className="text-sm text-gray-500">{agent.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(agent.status)}`}>
                    {getStatusIcon(agent.status)}
                    <span className="ml-1 capitalize">{agent.status}</span>
                  </span>
                </div>
              </div>

              {/* Agent Description */}
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                {agent.description}
              </p>

              {/* Agent Stats */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {agent.taskCount || 0}
                  </div>
                  <div className="text-xs text-gray-500">Tasks</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-semibold text-gray-900">
                    {agent.successRate ? `${agent.successRate}%` : 'N/A'}
                  </div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
              </div>

              {/* Agent Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Version</span>
                  <span>{agent.version}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Created</span>
                  <span>{new Date(agent.createdAt).toLocaleDateString()}</span>
                </div>
                {agent.lastActivity && (
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Last Activity</span>
                    <span>{new Date(agent.lastActivity).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {/* Agent Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/agents/${agent.id}`}
                    className="btn-secondary"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/agents/${agent.id}/edit`}
                    className="btn-secondary"
                    title="Configure"
                  >
                    <Settings className="w-4 h-4" />
                  </Link>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => toggleAgentStatus(agent.id, agent.status)}
                    className={`btn-secondary ${
                      agent.status === 'active' ? 'text-yellow-600' : 'text-green-600'
                    }`}
                    title={agent.status === 'active' ? 'Pause Agent' : 'Start Agent'}
                  >
                    {agent.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => deleteAgent(agent.id)}
                    className="btn-secondary text-red-600"
                    title="Delete Agent"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
} 