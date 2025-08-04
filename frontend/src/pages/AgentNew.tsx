import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { 
  ArrowLeft, 
  ArrowRight, 
  Bot, 
  MessageSquare, 
  Calendar, 
  FileText, 
  BarChart3, 
  Settings,
  Info,
  Zap,
  Target,
  Brain,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface AgentTemplate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  type: string
  defaultConfig: {
    model: string
    temperature: number
    maxTokens: number
    systemPrompt: string
  }
  features: string[]
}

const agentTemplates: AgentTemplate[] = [
  {
    id: 'customer-service',
    name: 'Customer Service Agent',
    description: 'Professional chatbot for website visitors and lead qualification',
    icon: MessageSquare,
    type: 'Customer Service',
    defaultConfig: {
      model: 'gemini-1.5-flash',
      temperature: 0.7,
      maxTokens: 1000,
      systemPrompt: `You are a professional customer service representative for Ethos Digital, a digital marketing and consulting agency. Your role is to:

1. Provide helpful information about our services (SEO, PPC, Web Development, Content Marketing, Social Media Management, Analytics)
2. Qualify leads by understanding their business needs and goals
3. Schedule consultations when appropriate
4. Maintain a professional, friendly tone
5. Ask follow-up questions to better understand client needs

Always represent Ethos Digital professionally and focus on helping potential clients understand how we can help grow their business.`
    },
    features: ['Lead Qualification', 'Service Information', 'Professional Tone', 'Consultation Scheduling']
  },
  {
    id: 'appointment-scheduler',
    name: 'Appointment Scheduler',
    description: 'Intelligent calendar management and consultation booking',
    icon: Calendar,
    type: 'Scheduling',
    defaultConfig: {
      model: 'gemini-1.5-flash',
      temperature: 0.5,
      maxTokens: 800,
      systemPrompt: `You are an appointment scheduling assistant for Ethos Digital. Your responsibilities include:

1. Checking calendar availability for consultations
2. Scheduling appointments based on client preferences
3. Generating lead summaries from conversations
4. Sending confirmation emails and reminders
5. Handling rescheduling and cancellations
6. Collecting necessary client information

Always be professional, confirm appointment details, and ensure all necessary information is collected before scheduling.`
    },
    features: ['Calendar Integration', 'Lead Summaries', 'Email Notifications', 'Rescheduling']
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'AI-powered content generation for blogs, social media, and marketing',
    icon: FileText,
    type: 'Content Creation',
    defaultConfig: {
      model: 'gemini-1.5-flash',
      temperature: 0.8,
      maxTokens: 2000,
      systemPrompt: `You are a content creation specialist for Ethos Digital. Your expertise includes:

1. Writing engaging blog posts and articles
2. Creating social media content and captions
3. Developing marketing copy and email campaigns
4. SEO-optimized content creation
5. Brand voice consistency
6. Content strategy recommendations

Always create high-quality, engaging content that aligns with client goals and brand guidelines.`
    },
    features: ['Blog Writing', 'Social Media', 'Email Campaigns', 'SEO Optimization']
  },
  {
    id: 'analytics-expert',
    name: 'Analytics Expert',
    description: 'Data analysis and performance reporting for marketing campaigns',
    icon: BarChart3,
    type: 'Analytics',
    defaultConfig: {
      model: 'gemini-1.5-flash',
      temperature: 0.3,
      maxTokens: 1500,
      systemPrompt: `You are an analytics expert for Ethos Digital. Your capabilities include:

1. Analyzing marketing campaign performance
2. Generating insights from data
3. Creating performance reports
4. Identifying optimization opportunities
5. Providing data-driven recommendations
6. Explaining complex metrics in simple terms

Always provide accurate, actionable insights based on data analysis.`
    },
    features: ['Performance Analysis', 'Data Insights', 'Report Generation', 'Optimization Recommendations']
  }
]

interface AgentFormData {
  name: string
  description: string
  type: string
  model: string
  temperature: number
  maxTokens: number
  systemPrompt: string
}

export default function AgentNew() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedTemplate, setSelectedTemplate] = useState<AgentTemplate | null>(null)
  const [formData, setFormData] = useState<AgentFormData>({
    name: '',
    description: '',
    type: '',
    model: 'gemini-1.5-flash',
    temperature: 0.7,
    maxTokens: 1000,
    systemPrompt: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const totalSteps = 3

  const handleTemplateSelect = (template: AgentTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      description: template.description,
      type: template.type,
      model: template.defaultConfig.model,
      temperature: template.defaultConfig.temperature,
      maxTokens: template.defaultConfig.maxTokens,
      systemPrompt: template.defaultConfig.systemPrompt
    })
  }

  const handleInputChange = (field: keyof AgentFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const createAgent = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await axios.post('/api/agents', {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        config: {
          model: formData.model,
          temperature: formData.temperature,
          maxTokens: formData.maxTokens,
          systemPrompt: formData.systemPrompt
        }
      })

      if (response.data.success) {
        navigate('/agents', { 
          state: { message: `Agent "${formData.name}" created successfully!` }
        })
      }
    } catch (error) {
      console.error('Error creating agent:', error)
      setError('Failed to create agent. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
            i + 1 < currentStep
              ? 'bg-green-500 text-white'
              : i + 1 === currentStep
              ? 'bg-primary-600 text-white'
              : 'bg-gray-200 text-gray-600'
          }`}>
            {i + 1 < currentStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div className={`w-16 h-1 mx-2 ${
              i + 1 < currentStep ? 'bg-green-500' : 'bg-gray-200'
            }`} />
          )}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Choose Agent Template</h2>
        <p className="mt-2 text-gray-600">Select a template to get started quickly, or customize from scratch</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agentTemplates.map((template) => (
          <div
            key={template.id}
            onClick={() => handleTemplateSelect(template)}
            className={`card cursor-pointer transition-all ${
              selectedTemplate?.id === template.id
                ? 'ring-2 ring-primary-500 bg-primary-50'
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                selectedTemplate?.id === template.id
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                <template.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{template.description}</p>
                <div className="mt-3">
                  <p className="text-xs font-medium text-gray-500 mb-2">Features:</p>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={() => handleTemplateSelect({
            id: 'custom',
            name: 'Custom Agent',
            description: 'Create a completely custom agent from scratch',
            icon: Bot,
            type: 'Custom',
            defaultConfig: {
              model: 'gemini-1.5-flash',
              temperature: 0.7,
              maxTokens: 1000,
              systemPrompt: ''
            },
            features: ['Fully Customizable']
          })}
          className="btn-secondary"
        >
          <Bot className="w-4 h-4 mr-2" />
          Create Custom Agent
        </button>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Agent Details</h2>
        <p className="mt-2 text-gray-600">Configure your agent's basic information</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="input-field"
            placeholder="e.g., Website Chatbot"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Agent Type *
          </label>
          <input
            type="text"
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="input-field"
            placeholder="e.g., Customer Service"
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={3}
          className="input-field"
          placeholder="Describe what this agent does and its purpose..."
          required
        />
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">AI Configuration</h2>
        <p className="mt-2 text-gray-600">Fine-tune your agent's AI behavior and responses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AI Model
          </label>
          <select
            value={formData.model}
            onChange={(e) => handleInputChange('model', e.target.value)}
            className="input-field"
          >
            <option value="gemini-1.5-flash">Gemini 1.5 Flash (Fast & Cost-effective)</option>
            <option value="gemini-1.5-pro">Gemini 1.5 Pro (More Capable)</option>
            <option value="gpt-4">GPT-4 (OpenAI)</option>
            <option value="claude-3-sonnet">Claude 3 Sonnet (Anthropic)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Temperature: {formData.temperature}
            <span className="ml-2 text-xs text-gray-500">
              {formData.temperature < 0.3 ? 'Focused' : 
               formData.temperature < 0.7 ? 'Balanced' : 'Creative'}
            </span>
          </label>
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={formData.temperature}
            onChange={(e) => handleInputChange('temperature', parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Focused</span>
            <span>Balanced</span>
            <span>Creative</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            <Info className="w-3 h-3 inline mr-1" />
            Lower values = more consistent, focused responses. Higher values = more creative, varied responses.
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Tokens: {formData.maxTokens}
        </label>
        <input
          type="range"
          min="100"
          max="4000"
          step="100"
          value={formData.maxTokens}
          onChange={(e) => handleInputChange('maxTokens', parseInt(e.target.value))}
          className="w-full"
        />
        <p className="text-xs text-gray-500 mt-2">
          <Info className="w-3 h-3 inline mr-1" />
          Maximum length of responses. Higher values allow longer, more detailed responses but cost more.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          System Prompt
          <span className="ml-2 text-xs text-gray-500">(Instructions for the AI)</span>
        </label>
        <textarea
          value={formData.systemPrompt}
          onChange={(e) => handleInputChange('systemPrompt', e.target.value)}
          rows={6}
          className="input-field"
          placeholder="Enter instructions that define how this agent should behave, respond, and what it should do..."
        />
        <p className="text-xs text-gray-500 mt-2">
          <Info className="w-3 h-3 inline mr-1" />
          This prompt tells the AI how to behave. Be specific about the agent's role, tone, and responsibilities.
        </p>
      </div>
    </div>
  )

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      default: return renderStep1()
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1: return selectedTemplate !== null
      case 2: return formData.name && formData.type && formData.description
      case 3: return true
      default: return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => navigate('/agents')}
          className="btn-secondary"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Agents
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Create New Agent</h1>
      </div>

      {/* Step Indicator */}
      {renderStepIndicator()}

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
            <span className="text-red-800">{error}</span>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="card">
        {renderCurrentStep()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </button>

        <div className="flex items-center space-x-3">
          {currentStep < totalSteps ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={createAgent}
              disabled={!canProceed() || loading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create Agent
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 