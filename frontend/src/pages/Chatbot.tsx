import { useState, useEffect, useRef } from 'react'
import { Send, Bot, User, Settings, BarChart3, Download } from 'lucide-react'
import axios from 'axios'

interface Message {
  id: string
  type: 'user' | 'bot'
  content: string
  timestamp: Date
  intent?: string
  confidence?: number
}

interface Conversation {
  id: string
  messages: Message[]
  startTime: Date
  status: 'active' | 'ended'
  intent?: string
  leadQualified: boolean
}

export default function Chatbot() {
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [conversation?.messages])

  const startNewConversation = async () => {
    try {
      setIsLoading(true)
      const response = await axios.post('/api/chatbot/conversation/start', {
        visitorId: `test_visitor_${Date.now()}`,
        initialMessage: 'Hello, I\'d like to learn more about your services'
      })

      if (response.data.success) {
        const newConversation: Conversation = {
          id: response.data.conversationId,
          messages: [
            {
              id: '1',
              type: 'bot',
              content: response.data.message,
              timestamp: new Date()
            }
          ],
          startTime: new Date(),
          status: 'active',
          leadQualified: false
        }

        setConversation(newConversation)
        setConversationHistory(prev => [newConversation, ...prev])
        setSelectedConversation(newConversation.id)
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!inputMessage.trim() || !conversation) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    }

    // Add user message to conversation
    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, userMessage]
    }
    setConversation(updatedConversation)
    setInputMessage('')
    setIsLoading(true)

    try {
      const response = await axios.post('/api/chatbot/message', {
        conversationId: conversation.id,
        message: inputMessage,
        visitorId: `test_visitor_${Date.now()}`
      })

      if (response.data.success) {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'bot',
          content: response.data.response,
          timestamp: new Date(),
          intent: response.data.intent,
          confidence: response.data.confidence
        }

        const finalConversation = {
          ...updatedConversation,
          messages: [...updatedConversation.messages, botMessage],
          intent: response.data.intent,
          leadQualified: response.data.shouldQualifyLead || conversation.leadQualified
        }

        setConversation(finalConversation)
        
        // Update conversation in history
        setConversationHistory(prev => 
          prev.map(conv => 
            conv.id === conversation.id ? finalConversation : conv
          )
        )
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setConversation({
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorMessage]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const loadConversation = async (conversationId: string) => {
    try {
      const response = await axios.get(`/api/chatbot/conversation/${conversationId}`)
      if (response.data.success) {
        setConversation(response.data.conversation)
        setSelectedConversation(conversationId)
      }
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  const exportConversation = () => {
    if (!conversation) return

    const dataStr = JSON.stringify(conversation, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `conversation_${conversation.id}_${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chatbot Testing</h1>
          <p className="mt-1 text-sm text-gray-500">
            Test and monitor the Ethos Digital website chatbot
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={startNewConversation}
            disabled={isLoading}
            className="btn-primary flex items-center"
          >
            <Bot className="h-4 w-4 mr-2" />
            New Conversation
          </button>
          {conversation && (
            <button
              onClick={exportConversation}
              className="btn-secondary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversation History */}
        <div className="lg:col-span-1">
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Conversation History</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {conversationHistory.length === 0 ? (
                <p className="text-sm text-gray-500">No conversations yet</p>
              ) : (
                conversationHistory.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => loadConversation(conv.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedConversation === conv.id
                        ? 'border-primary-300 bg-primary-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900 truncate">
                        Conversation {conv.id.slice(-8)}
                      </span>
                      <span className={`status-badge ${
                        conv.status === 'active' ? 'status-active' : 'status-inactive'
                      }`}>
                        {conv.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {conv.messages.length} messages • {new Date(conv.startTime).toLocaleDateString()}
                    </p>
                    {conv.intent && (
                      <p className="text-xs text-primary-600 mt-1">
                        Intent: {conv.intent}
                      </p>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <div className="card h-[600px] flex flex-col">
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-4">
              <div className="flex items-center">
                <Bot className="h-6 w-6 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">Ethos Digital Chatbot</h3>
                  <p className="text-sm text-gray-500">
                    {conversation ? `Conversation ${conversation.id.slice(-8)}` : 'No active conversation'}
                  </p>
                </div>
              </div>
              {conversation && (
                <div className="flex items-center space-x-2">
                  {conversation.intent && (
                    <span className="status-badge status-active">
                      {conversation.intent}
                    </span>
                  )}
                  {conversation.leadQualified && (
                    <span className="status-badge status-warning">
                      Lead Qualified
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 mb-4">
              {!conversation ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Start a new conversation to begin testing</p>
                  </div>
                </div>
              ) : (
                conversation.messages.map((message) => (
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
                      <div className="flex items-start space-x-2">
                        {message.type === 'bot' && (
                          <Bot className="h-4 w-4 text-primary-600 mt-0.5 flex-shrink-0" />
                        )}
                        {message.type === 'user' && (
                          <User className="h-4 w-4 text-white mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm">{message.content}</p>
                          {message.intent && message.type === 'bot' && (
                            <p className="text-xs text-gray-500 mt-1">
                              Intent: {message.intent} ({(message.confidence || 0) * 100}%)
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 max-w-xs lg:max-w-md px-4 py-2 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Bot className="h-4 w-4 text-primary-600" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  disabled={!conversation || isLoading}
                  className="input-field flex-1"
                />
                <button
                  onClick={sendMessage}
                  disabled={!conversation || !inputMessage.trim() || isLoading}
                  className="btn-primary"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 