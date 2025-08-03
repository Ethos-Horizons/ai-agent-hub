import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Bot, Plus, Settings, Play, Pause, Trash2, Eye } from 'lucide-react'
import axios from 'axios'

interface Agent {
  id: string
  name: string
  type: string
  description: string
  status: 'active' | 'inactive' | 'error'
  version: string
  createdAt: string
  lastActivity: string
  taskCount: number
  successRate: number
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAgents()
  }, [])

  const fetchAgents = async () => {
    try {
      const response = await axios.get('/api/agents')
      if (response.data.success) {
        setAgents(response.data.agents)
      }
    } catch (error) {
      console.error('Error fetching agents:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAgentStatus = async (agentId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
      await axios.put(`/api/agents/${agentId}`, { status: newStatus })
      fetchAgents() // Refresh the list
    } catch (error) {
      console.error('Error updating agent status:', error)
    }
  }

  const deleteAgent = async (agentId: string) => {
    if (!confirm('Are you sure you want to delete this agent?')) return
    
    try {
      await axios.delete(`/api/agents/${agentId}`)
      fetchAgents() // Refresh the list
    } catch (error) {
      console.error('Error deleting agent:', error)
    }
  }

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
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
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Link>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                <Bot className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                  <p className="text-sm text-gray-500">{agent.type}</p>
                </div>
              </div>
              <span className={`status-badge ${getStatusColor(agent.status)}`}>
                {agent.status}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4">{agent.description}</p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Tasks</p>
                <p className="text-sm font-medium text-gray-900">{agent.taskCount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Success Rate</p>
                <p className="text-sm font-medium text-gray-900">{agent.successRate}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <span>v{agent.version}</span>
              <span>Last active: {new Date(agent.lastActivity).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                <Link
                  to={`/agents/${agent.id}`}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => toggleAgentStatus(agent.id, agent.status)}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title={agent.status === 'active' ? 'Pause Agent' : 'Start Agent'}
                >
                  {agent.status === 'active' ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                </button>
                <Link
                  to={`/agents/${agent.id}/settings`}
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  title="Settings"
                >
                  <Settings className="h-4 w-4" />
                </Link>
              </div>
              <button
                onClick={() => deleteAgent(agent.id)}
                className="p-2 text-red-400 hover:text-red-600 transition-colors"
                title="Delete Agent"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No agents yet</h3>
          <p className="text-gray-500 mb-6">Create your first AI agent to get started</p>
          <Link to="/agents/new" className="btn-primary">
            Create Your First Agent
          </Link>
        </div>
      )}
    </div>
  )
} 