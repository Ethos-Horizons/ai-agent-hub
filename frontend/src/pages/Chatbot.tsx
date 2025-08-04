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
  Brain,
  Terminal,
  Calendar,
  AlertCircle,
  CheckCircle,
  Info
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

interface AgentLog {
  id: string
  timestamp: Date
  level: 'info' | 'warning' | 'error' | 'success'
  message: string
  data?: any
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
  
  // Background agent testing
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([])
  const [simulatedConversation, setSimulatedConversation] = useState<string>('')
  const [backgroundAgentActive, setBackgroundAgentActive] = useState(false)

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

  const addAgentLog = (level: AgentLog['level'], message: string, data?: any) => {
    const log: AgentLog = {
      id: Date.now().toString(),
      timestamp: new Date(),
      level,
      message,
      data
    }
    setAgentLogs(prev => [...prev, log])
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

      // For background agents, start monitoring
      if (selectedAgent.type === 'Scheduling') {
        setBackgroundAgentActive(true)
        addAgentLog('info', 'Appointment Scheduler activated - monitoring for scheduling intent')
      }
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

    // For background agents, process the message for scheduling intent
    if (selectedAgent.type === 'Scheduling' && backgroundAgentActive) {
      processBackgroundAgentMessage(inputMessage)
    }

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

      // Check if scheduling intent was detected
      if (response.data.intent?.includes('appointment') || response.data.intent?.includes('schedule')) {
        addAgentLog('warning', 'Scheduling intent detected!', {
          intent: response.data.intent,
          confidence: response.data.confidence,
          userMessage: inputMessage,
          botResponse: response.data.response
        })
      }
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

  const processBackgroundAgentMessage = (message: string) => {
    // Simulate background agent processing
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('appointment') || lowerMessage.includes('schedule') || lowerMessage.includes('meet')) {
      addAgentLog('info', 'Scheduling intent detected in conversation')
      
      // Extract potential date/time information
      const timePatterns = [
        /(\d{1,2}):(\d{2})\s*(am|pm)/i,
        /(\d{1,2})\s*(am|pm)/i,
        /(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i,
        /(january|february|march|april|may|june|july|august|september|october|november|december)/i
      ]
      
      timePatterns.forEach(pattern => {
        const match = message.match(pattern)
        if (match) {
          addAgentLog('success', `Time/Date detected: ${match[0]}`, { extracted: match[0] })
        }
      })
    }

    if (lowerMessage.includes('consultation') || lowerMessage.includes('meeting')) {
      addAgentLog('info', 'Consultation request detected - preparing lead summary')
    }

    // Enhanced scheduling simulation
    if (lowerMessage.includes('available') || lowerMessage.includes('work') || lowerMessage.includes('good')) {
      simulateCalendarCheck(message)
    }

    // Extract business information for lead summary
    extractBusinessInfo(message)
  }

  const simulateCalendarCheck = (message: string) => {
    addAgentLog('info', 'Checking calendar availability...')
    
    // Simulate calendar API call
    setTimeout(() => {
      const availableSlots = [
        'Wednesday, August 7th at 10:00 AM',
        'Wednesday, August 7th at 2:00 PM', 
        'Thursday, August 8th at 11:00 AM',
        'Friday, August 9th at 3:00 PM'
      ]
      
      addAgentLog('success', 'Calendar check completed', { 
        availableSlots,
        nextAvailable: availableSlots[0]
      })
      
      addAgentLog('info', `Found ${availableSlots.length} available slots this week`)
    }, 1000)
  }

  const extractBusinessInfo = (message: string) => {
    const businessInfo = {
      industry: '',
      budget: '',
      goals: [] as string[],
      challenges: [] as string[]
    }

    // Extract industry
    const industries = ['restaurant', 'e-commerce', 'retail', 'service', 'consulting', 'healthcare', 'real estate']
    industries.forEach(industry => {
      if (message.toLowerCase().includes(industry)) {
        businessInfo.industry = industry
        addAgentLog('info', `Industry detected: ${industry}`)
      }
    })

    // Extract budget
    const budgetPatterns = [
      /(\$[\d,]+)/g,
      /(\d+)\s*(k|thousand)/i,
      /budget.*?(\d+)/i
    ]
    
    budgetPatterns.forEach(pattern => {
      const match = message.match(pattern)
      if (match) {
        businessInfo.budget = match[0]
        addAgentLog('info', `Budget mentioned: ${match[0]}`)
      }
    })

    // Extract goals
    const goalKeywords = ['traffic', 'sales', 'leads', 'conversion', 'ranking', 'visibility', 'brand']
    goalKeywords.forEach(goal => {
      if (message.toLowerCase().includes(goal)) {
        businessInfo.goals.push(goal)
      }
    })

    if (businessInfo.goals.length > 0) {
      addAgentLog('info', `Goals identified: ${businessInfo.goals.join(', ')}`)
    }

    // Generate lead summary if we have enough info
    if (businessInfo.industry || businessInfo.budget || businessInfo.goals.length > 0) {
      setTimeout(() => {
        generateLeadSummary(businessInfo)
      }, 2000)
    }
  }

  const generateLeadSummary = (businessInfo: any) => {
    const summary = {
      timestamp: new Date().toISOString(),
      businessType: businessInfo.industry || 'Not specified',
      budget: businessInfo.budget || 'Not specified',
      primaryGoals: businessInfo.goals.length > 0 ? businessInfo.goals.join(', ') : 'Not specified',
      urgency: 'Medium',
      recommendedServices: [] as string[],
      nextSteps: [] as string[]
    }

    // Determine recommended services based on goals
    if (businessInfo.goals.includes('traffic') || businessInfo.goals.includes('ranking')) {
      summary.recommendedServices.push('SEO Optimization')
    }
    if (businessInfo.goals.includes('leads') || businessInfo.goals.includes('conversion')) {
      summary.recommendedServices.push('PPC Advertising')
    }
    if (businessInfo.goals.includes('brand') || businessInfo.goals.includes('visibility')) {
      summary.recommendedServices.push('Social Media Marketing')
    }

    summary.nextSteps = [
      'Schedule initial consultation',
      'Prepare custom proposal',
      'Set up analytics tracking',
      'Begin discovery phase'
    ]

    addAgentLog('success', 'Lead Summary Generated', summary)
    
    // Simulate appointment scheduling
    setTimeout(() => {
      simulateAppointmentScheduling(summary)
    }, 1500)
  }

  const simulateAppointmentScheduling = (leadSummary: any) => {
    addAgentLog('info', 'Initiating appointment scheduling process...')
    
    setTimeout(() => {
      const appointment = {
        id: `apt_${Date.now()}`,
        date: 'Wednesday, August 7th, 2024',
        time: '10:00 AM - 11:00 AM',
        type: 'Initial Consultation',
        attendee: 'Christopher McElwain',
        location: 'Video Call (Zoom)',
        agenda: [
          'Business overview and current challenges',
          'Marketing goals and objectives',
          'Budget discussion and timeline',
          'Next steps and proposal timeline'
        ]
      }

      addAgentLog('success', 'Appointment Scheduled Successfully!', appointment)
      
      // Simulate email notifications
      setTimeout(() => {
        addAgentLog('info', 'Sending confirmation emails...')
        addAgentLog('success', 'Confirmation email sent to client')
        addAgentLog('success', 'Calendar invitation sent to Christopher McElwain')
        addAgentLog('success', 'Lead notification sent to sales team')
      }, 1000)
    }, 2000)
  }

  const clearConversation = () => {
    setConversation([])
    setConversationId(null)
    setAgentLogs([])
    setBackgroundAgentActive(false)
  }

  const exportConversation = () => {
    const data = {
      agent: selectedAgent?.name,
      timestamp: new Date().toISOString(),
      conversation: conversation,
      agentLogs: agentLogs
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `agent-test-${selectedAgent?.name}-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const updateAgentConfig = (key: string, value: any) => {
    setAgentConfig(prev => ({ ...prev, [key]: value }))
  }

  const isBackgroundAgent = selectedAgent?.type === 'Scheduling'

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
                      {agent.type === 'Scheduling' && (
                        <div className="flex items-center mt-1">
                          <Terminal className="w-3 h-3 text-blue-500 mr-1" />
                          <span className="text-xs text-blue-600">Background Agent</span>
                        </div>
                      )}
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

        {/* Main Testing Area */}
        <div className="lg:col-span-3">
          {isBackgroundAgent ? (
            /* Background Agent Testing Interface */
            <div className="space-y-6">
              {/* Chat Interface (for simulating conversation) */}
              <div className="card h-[400px] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Simulated Conversation</h3>
                      <p className="text-sm text-gray-500">
                        Chat with the main chatbot to trigger the appointment scheduler
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
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversation.length === 0 ? (
                    <div className="text-center py-12">
                      <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation yet</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Start a conversation to see the appointment scheduler in action.
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
                      placeholder="Type your message to trigger appointment scheduling..."
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

              {/* Background Agent Terminal */}
              <div className="card h-[300px] flex flex-col">
                <div className="flex items-center justify-between p-4 border-b">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Terminal className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">Appointment Scheduler Terminal</h3>
                      <p className="text-sm text-gray-500">
                        {backgroundAgentActive ? 'Active - Monitoring conversation' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${backgroundAgentActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className="text-xs text-gray-500">
                      {backgroundAgentActive ? 'RUNNING' : 'STOPPED'}
                    </span>
                  </div>
                </div>

                {/* Terminal Output */}
                <div className="flex-1 overflow-y-auto p-4 bg-gray-900 text-green-400 font-mono text-sm">
                  {agentLogs.length === 0 ? (
                    <div className="text-gray-500">
                      <p>// Appointment Scheduler Terminal</p>
                      <p>// Waiting for conversation to begin...</p>
                      <p>// Agent will activate when scheduling intent is detected</p>
                    </div>
                  ) : (
                    agentLogs.map((log) => (
                      <div key={log.id} className="mb-2">
                        <span className="text-gray-500">
                          [{log.timestamp.toLocaleTimeString()}]
                        </span>
                        <span className={`ml-2 ${
                          log.level === 'error' ? 'text-red-400' :
                          log.level === 'warning' ? 'text-yellow-400' :
                          log.level === 'success' ? 'text-green-400' :
                          'text-blue-400'
                        }`}>
                          [{log.level.toUpperCase()}]
                        </span>
                        <span className="ml-2">{log.message}</span>
                        {log.data && (
                          <div className="ml-4 mt-1 text-xs text-gray-400">
                            {JSON.stringify(log.data, null, 2)}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* Regular Chat Interface for Conversational Agents */
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
          )}
        </div>
      </div>
    </div>
  )
} 