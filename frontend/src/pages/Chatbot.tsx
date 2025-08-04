import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { 
  MessageSquare, 
  Send, 
  Download, 
  Trash2, 
  Settings, 
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  Clock,
  User,
  Bot,
  ChevronDown,
  Plus,
  Zap,
  Target,
  Brain
} from 'lucide-react'

interface Agent {
  id: string
  name: string
  type: string
  description: string
  status: 'active' | 'inactive' | 'training' | 'error'
  config: {
    model: string
    temperature: number
    maxTokens: number
    systemPrompt?: string
  }
  performance?: {
    totalConversations: number
    successRate: number
    averageResponseTime: number
  }
}

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  metadata?: {
    intent?: string
    confidence?: number
    suggestions?: string[]
  }
}

export default function AgentPlayground() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [conversation, setConversation] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [agentConfig, setAgentConfig] = useState({
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: ''
  })
  const [showConfig, setShowConfig] = useState(false)
  const [testMode, setTestMode] = useState<'conversation' | 'performance' | 'comparison'>('conversation')

  // Load agents on component mount
  useEffect(() => {
    loadAgents()
  }, [])

  const loadAgents = async () => {
    try {
      const response = await axios.get('/api/agents')
      setAgents(response.data.agents)
      if (response.data.agents.length > 0) {
        setSelectedAgent(response.data.agents[0])
      }
    } catch (error) {
      console.error('Error loading agents:', error)
    }
  }

  const startNewConversation = async () => {
    if (!selectedAgent) return

    try {
      setLoading(true)
      const response = await axios.post('/api/chatbot/conversation/start', {
        visitorId: `test_${Date.now()}`,
        agentId: selectedAgent.id
      })

      setConversationId(response.data.conversationId)
      setConversation([{
        id: '1',
        type: 'bot',
        content: response.data.message,
        timestamp: new Date()
      }])
    } catch (error) {
      console.error('Error starting conversation:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversationId || !selectedAgent) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    setConversation(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const response = await axios.post('/api/chatbot/message', {
        conversationId,
        message: inputMessage,
        visitorId: `test_${Date.now()}`,
        agentId: selectedAgent.id,
        config: agentConfig
      })

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: response.data.response,
        timestamp: new Date(),
        metadata: {
          intent: response.data.intent,
          confidence: response.data.confidence,
          suggestions: response.data.suggestions
        }
      }

      setConversation(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setConversation(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearConversation = () => {
    setConversation([])
    setConversationId(null)
  }

  const exportConversation = () => {
    const data = {
      agent: selectedAgent?.name,
      timestamp: new Date().toISOString(),
      conversation: conversation
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `conversation-${selectedAgent?.name}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const updateAgentConfig = (key: string, value: any) => {
    setAgentConfig(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agent Playground</h1>
          <p className="mt-1 text-sm text-gray-500">
            Test and configure your AI agents in real-time
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="btn-secondary"
          >
            <Settings className="w-4 h-4 mr-2" />
            {showConfig ? 'Hide' : 'Show'} Config
          </button>
          <button
            onClick={startNewConversation}
            disabled={!selectedAgent || loading}
            className="btn-primary"
          >
            <Play className="w-4 h-4 mr-2" />
            New Test
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agent Selection & Configuration */}
        <div className="lg:col-span-1 space-y-4">
          {/* Agent Selector */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Select Agent</h3>
            <div className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAgent?.id === agent.id
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      agent.status === 'active' ? 'bg-green-500' :
                      agent.status === 'inactive' ? 'bg-gray-400' :
                      agent.status === 'training' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{agent.name}</h4>
                      <p className="text-sm text-gray-500">{agent.type}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agent Configuration */}
          {showConfig && selectedAgent && (
            <div className="card">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Agent Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Temperature: {agentConfig.temperature}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={agentConfig.temperature}
                    onChange={(e) => updateAgentConfig('temperature', parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Higher = more creative, Lower = more focused
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Tokens: {agentConfig.maxTokens}
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="4000"
                    step="100"
                    value={agentConfig.maxTokens}
                    onChange={(e) => updateAgentConfig('maxTokens', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    System Prompt
                  </label>
                  <textarea
                    value={agentConfig.systemPrompt}
                    onChange={(e) => updateAgentConfig('systemPrompt', e.target.value)}
                    rows={4}
                    className="input-field"
                    placeholder="Custom system prompt for this agent..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Test Mode Selector */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Test Mode</h3>
            <div className="space-y-2">
              {[
                { id: 'conversation', name: 'Conversation', icon: MessageSquare },
                { id: 'performance', name: 'Performance', icon: BarChart3 },
                { id: 'comparison', name: 'Comparison', icon: Target }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setTestMode(mode.id as any)}
                  className={`w-full flex items-center space-x-2 p-2 rounded-lg text-left transition-colors ${
                    testMode === mode.id
                      ? 'bg-primary-100 text-primary-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <mode.icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{mode.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="card h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">
                    {selectedAgent?.name || 'Select an Agent'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedAgent?.description || 'Choose an agent to start testing'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={clearConversation}
                  className="btn-secondary"
                  title="Clear conversation"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={exportConversation}
                  className="btn-secondary"
                  title="Export conversation"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {conversation.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start a new test to begin chatting with the selected agent.
                  </p>
                </div>
              ) : (
                conversation.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      {message.metadata?.suggestions && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <p className="text-xs text-gray-500 mb-1">Suggestions:</p>
                          <div className="flex flex-wrap gap-1">
                            {message.metadata.suggestions.map((suggestion, index) => (
                              <button
                                key={index}
                                onClick={() => setInputMessage(suggestion)}
                                className="text-xs bg-white px-2 py-1 rounded border hover:bg-gray-50"
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Agent is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 input-field"
                  disabled={!selectedAgent || loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={!inputMessage.trim() || !selectedAgent || loading}
                  className="btn-primary"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 